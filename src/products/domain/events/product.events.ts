export interface OrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

// Evento entrante desde orders-ms
export interface OrderCreatedEvent {
  orderId: string;
  items: OrderItemPayload[];
  totalAmount: number;
}

// Evento entrante (compensación): liberar stock reservado
export interface InventoryReleaseEvent {
  orderId: string;
}

// Eventos salientes
export interface InventoryReservedEvent {
  orderId: string;
  items: OrderItemPayload[];
  totalAmount: number;
}

export interface InventoryReservationFailedEvent {
  orderId: string;
  reason: string;
}

export interface InventoryReleasedEvent {
  orderId: string;
}
