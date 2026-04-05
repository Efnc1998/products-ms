import { Controller, Logger, ParseIntPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from '../../domain/ports/products.service';
import { CreateProductDto } from '../../domain/dto/create-product.dto';
import { UpdateProductDto } from '../../domain/dto/update-product.dto';
import { InventoryService } from '../../application/services/inventory.service';
import {
  InventoryReleaseEvent,
  OrderCreatedEvent,
} from '../../domain/events/product.events';
import { PaginationDto } from '@/shared';

@Controller()
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly inventoryService: InventoryService,
  ) {}

  // ─── Comandos síncronos (request/reply) ──────────────────────────────────

  @MessagePattern('create_product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('find_all_products')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern('find_one_product')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('update_product')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern('delete_product')
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // ─── Eventos SAGA: gestión de inventario ─────────────────────────────────

  /**
   * Paso 2 de la SAGA: reserva el stock de los ítems pedidos.
   * Emite inventory.reserved o inventory.reservation_failed.
   */
  @EventPattern('order.created')
  async onOrderCreated(@Payload() event: OrderCreatedEvent) {
    this.logger.log(`Evento: order.created para orden ${event.orderId}`);
    await this.inventoryService.reserveInventory(event);
  }

  /**
   * Compensación SAGA: libera el stock reservado cuando el pago falla.
   */
  @EventPattern('inventory.release')
  async onInventoryRelease(@Payload() event: InventoryReleaseEvent) {
    this.logger.log(
      `Evento: inventory.release para orden ${event.orderId} (compensación)`,
    );
    await this.inventoryService.releaseInventory(event);
  }
}
