import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProductRepository } from '../../domain/ports/product.repository';
import {
  InventoryReleasedEvent,
  InventoryReservationFailedEvent,
  InventoryReservedEvent,
  InventoryReleaseEvent,
  OrderCreatedEvent,
  OrderItemPayload,
} from '../../domain/events/product.events';

/**
 * Servicio de inventario — gestiona la reserva y liberación de stock
 * como parte del patrón SAGA orquestado por orders-ms.
 */
@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Reserva stock para todos los ítems de una orden.
   * Si algún ítem no tiene stock suficiente, hace rollback de las reservas anteriores
   * y emite inventory.reservation_failed.
   */
  async reserveInventory(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(`Reservando inventario para orden: ${event.orderId}`);

    const reserved: OrderItemPayload[] = [];

    for (const item of event.items) {
      const product = await this.productRepository.findOne(item.productId);

      if (!product || product.stock < item.quantity) {
        const reason = !product
          ? `Producto #${item.productId} no encontrado`
          : `Stock insuficiente para producto #${item.productId} (disponible: ${product.stock}, requerido: ${item.quantity})`;

        this.logger.warn(
          `[SAGA] Reserva fallida para orden ${event.orderId}: ${reason}`,
        );

        // Compensación: revertir reservas ya realizadas
        for (const prev of reserved) {
          await this.productRepository.adjustStock(
            prev.productId,
            +prev.quantity,
          );
        }

        const failEvent: InventoryReservationFailedEvent = {
          orderId: event.orderId,
          reason,
        };
        this.kafkaClient.emit('inventory.reservation_failed', failEvent);
        return;
      }

      // Decrementar stock (ajuste negativo = reserva)
      await this.productRepository.adjustStock(item.productId, -item.quantity);
      reserved.push(item);
    }

    const successEvent: InventoryReservedEvent = {
      orderId: event.orderId,
      items: event.items,
      totalAmount: event.totalAmount,
    };

    this.kafkaClient.emit('inventory.reserved', successEvent);
    this.logger.log(
      `Inventario reservado para orden ${event.orderId} — ${reserved.length} producto(s)`,
    );
  }

  /**
   * Libera stock previamente reservado (acción de compensación de la SAGA).
   */
  releaseInventory(event: InventoryReleaseEvent): void {
    this.logger.log(`Liberando inventario para orden: ${event.orderId}`);
    // En un sistema real se consultaría los ítems de la orden en un cache o event store.
    // Para este demo, emitimos el evento de confirmación.
    const releasedEvent: InventoryReleasedEvent = { orderId: event.orderId };
    this.kafkaClient.emit('inventory.released', releasedEvent);
    this.logger.log(`Inventario liberado para orden: ${event.orderId}`);
  }
}
