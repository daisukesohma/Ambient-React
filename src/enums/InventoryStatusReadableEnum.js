const InventoryStatusEnum = Object.freeze({
  NEW: 'New',
  PENDING_BUILD: 'Pending Build',
  PENDING_INSTALLATION: 'Pending Installation',
  READY_TO_SHIP: 'Ready to Ship',
  READY_FOR_REVIEW: 'Ready for Review',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  ONLINE: 'Online',
  PROVISIONED: 'Provisioned',
  BLOCKED: 'Blocked',
})

export default InventoryStatusEnum
