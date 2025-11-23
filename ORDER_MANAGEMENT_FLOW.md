# Order Management Flow

## Luồng trạng thái Đơn Hàng (Order Status Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PENDING (Chờ thanh toán) ─────────────┐                  │
│  Vừa tạo từ Quote                      │                  │
│                                        ▼                  │
│                                  [💳 Thanh toán]           │
│                                  Tạo Payment               │
│                                        │                  │
│                                        ▼                  │
│                            PAID (Đã thanh toán)           │
│                                        │                  │
│                                        ▼                  │
│                                  [🚚 Giao hàng]            │
│                                  Tạo VehicleDelivery       │
│                                        │                  │
│                                        ▼                  │
│                      PENDING_DELIVERY (Chờ giao hàng)     │
│                                        │                  │
│                                        ▼                  │
│                              DELIVERED (Đã giao hàng)     │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Chi tiết các giai đoạn

### 1️⃣ PENDING → Tạo Payment → PAID
- **Điều kiện**: Order status = `PENDING`
- **Hành động**: Nhấn button "💳 Thanh toán"
- **Modal**: PaymentModal
- **API**: `POST /order/{orderId}/process-payment`
- **Payload**:
  ```json
  {
    "paymentType": "FULL_PAYMENT|INSTALLMENT",
    "paymentPlanId": 0  // chỉ dùng khi INSTALLMENT
  }
  ```
- **Kết quả**: Order status → `PAID` (Đã thanh toán)
- **Backend**: Tạo Payment record với status = `PAID`

### 2️⃣ PAID → Tạo VehicleDelivery → PENDING_DELIVERY
- **Điều kiện**: Order status = `PAID`
- **Hành động**: Nhấn button "🚚 Giao hàng"
- **Modal**: DeliveryModal
- **API**: `POST /order/{orderId}/delivery`
- **Payload**:
  ```json
  {
    "employeeId": 1,
    "name": "Tên người nhận",
    "phoneNumber": "0123456789",
    "address": "Địa chỉ giao hàng"
  }
  ```
- **Kết quả**: Order status → `PENDING_DELIVERY` (Chờ giao hàng)
- **Backend**: Tạo VehicleDelivery record

### 3️⃣ PENDING_DELIVERY → DELIVERED
- **Tự động hoặc Manual**: Cập nhật qua `PATCH /order/{orderId}/delivery`
- **Kết quả**: Order status → `DELIVERED` (Đã giao hàng)

## Trạng thái Thanh toán (Payment Status)
- **PAID**: Đã thanh toán
- **UNPAID**: Chưa thanh toán

## Trạng thái Giao hàng (VehicleDelivery Status)
- **PREPARING**: Chuẩn bị
- **DELIVERING**: Đang giao
- **DELIVERED**: Đã giao
- **CANCELED**: Đã hủy

## Key Points
✅ Mỗi order vừa tạo từ Quote sẽ ở trạng thái `PENDING`
✅ Payment được tạo cùng lúc với order (từ backend)
✅ Chỉ sau khi xử lý thanh toán (status = PAID) mới được tạo delivery
✅ Delivery chỉ xuất hiện khi status = PAID
✅ Flow không thể bỏ qua bước nào
