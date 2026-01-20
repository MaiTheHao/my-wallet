# SweetAlert2 Integration Guide

## 📦 Setup

SweetAlert2 đã được tích hợp vào toàn bộ project với các utility functions tái sử dụng.

## 🎯 Usage

### Import

```typescript
// Sử dụng các utility functions
import { confirmDelete, confirmDeleteBatch, showSuccess, showError, showInfo } from '@/lib/utils/swal.config';

// Hoặc sử dụng custom hook (recommended cho React components)
import { useSwal } from '@/hooks/useSwal';
```

### Confirm Delete

```typescript
const isConfirmed = await confirmDelete('giao dịch');
if (isConfirmed) {
	// Xóa item
}
```

### Confirm Batch Delete

```typescript
const isConfirmed = await confirmDeleteBatch(5, 'giao dịch');
if (isConfirmed) {
	// Xóa nhiều items
}
```

### Show Success

```typescript
await showSuccess('Đã lưu thành công!');
// hoặc với custom title
await showSuccess('Đã lưu thành công!', 'Hoàn tất!');
```

### Show Error

```typescript
await showError('Có lỗi xảy ra');
// hoặc với custom title
await showError('Không thể kết nối server', 'Lỗi kết nối');
```

### Show Info

```typescript
await showInfo('Thông tin đã được cập nhật');
```

## 🎨 Custom Hook (Recommended)

```typescript
const YourComponent = () => {
  const swal = useSwal();

  const handleDelete = async () => {
    if (await swal.confirm('sản phẩm')) {
      // Delete logic
      await swal.success('Đã xóa sản phẩm!');
    }
  };

  return <button onClick={handleDelete}>Xóa</button>;
};
```

## 🎭 Customization

Edit `src/lib/utils/swal.config.ts` để thay đổi theme, màu sắc, và behavior mặc định.

### Theme Options

```typescript
{
  confirmButtonColor: '#dc2626',  // Red
  cancelButtonColor: '#6b7280',   // Gray
  timer: 1500,                     // Auto close sau 1.5s
  showConfirmButton: false         // Ẩn nút confirm khi auto close
}
```

## 📍 Where It's Used

- ✅ `useTransactions.ts` - Delete & Batch delete confirmations
- ✅ `useChat.ts` - AI error notifications
- ✅ `useBalance.ts` - Balance fetch errors
- ✅ `TransactionContextProvider.tsx` - Transaction operations feedback
- ✅ `TransactionTable.tsx` - UI delete confirmations

## 🔥 Best Practices

1. **Always use utility functions** thay vì gọi `Swal.fire()` trực tiếp
2. **Use async/await** để đợi user response
3. **Consistent messaging** - Dùng tiếng Việt nhất quán
4. **Auto-dismiss success** - Success messages tự đóng sau 1.5s
5. **Manual dismiss errors** - Error messages cần user click OK

## 🚀 Future Enhancements

- [ ] Toast notifications cho non-blocking messages
- [ ] Custom animations
- [ ] Dark mode support
- [ ] Multi-language support
