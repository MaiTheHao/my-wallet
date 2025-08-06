# My Wallet - Quản lý chi tiêu cá nhân với AI

## Mục lục

-   [English](eng.md)
-   [Tiếng Việt](#tiếng-việt)

---

## Tiếng Việt

Đây là ứng dụng web quản lý chi tiêu cá nhân đơn giản, sử dụng AI để phân tích và ghi nhận giao dịch qua mô tả tự nhiên.

### Thiết lập nhanh

Chỉ cần thiết lập các biến môi trường như trong file `.env.example`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_uri_here
```

### Công nghệ

-   Ứng dụng sử dụng [Google AI Studio](https://ai.google.dev/) để giao tiếp với AI.
-   Có thể thay đổi model AI sử dụng trong file [`src/services/AIService.ts`](src/services/AIService.ts) (ví dụ: `gemini-2.5-flash`).

### Lưu ý

Đây là phiên bản v1 được thiết kế nhanh theo dạng MVP nên còn nhiều hạn chế.
