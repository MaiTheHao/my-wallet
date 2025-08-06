# My Wallet - Quản lý chi tiêu cá nhân với AI

## Mục lục

-   [English](eng.md)
-   [Tiếng Việt](#tiếng-việt)

---

## Tiếng Việt

Đây là ứng dụng web quản lý chi tiêu cá nhân đơn giản, sử dụng AI để phân tích và ghi nhận giao dịch qua mô tả tự nhiên.

---

## Hướng dẫn thiết lập

1. **Biến môi trường**

    Sao chép file `.env.example` thành `.env` và điền thông tin:

    ```bash
    GOOGLE_AI_STUDIO_API_KEY=your_GOOGLE_AI_STUDIO_API_KEY_here
    MONGODB_URI=your_mongodb_uri_here
    NEXT_PUBLIC_API_BASE_URL=https://duong-dan-api-cua-ban.com/
    ```

    - `GOOGLE_AI_STUDIO_API_KEY`: API key từ [Google AI Studio](https://ai.google.dev/).
    - `MONGODB_URI`: Chuỗi kết nối MongoDB.
    - `NEXT_PUBLIC_API_BASE_URL`: Địa chỉ API (dùng URL đã deploy cho production, hoặc để trống khi phát triển local).

2. **File cấu hình**

    Cấu hình chính nằm ở [`src/app.config.ts`](../src/app.config.ts):

    - `api.baseUrl`: Dùng `NEXT_PUBLIC_API_BASE_URL` khi production, hoặc `http://localhost:3000/` khi phát triển.
    - `google_ai_studio.apiKey`: Đọc từ biến môi trường.
    - `google_ai_studio.model`: Mặc định là `gemini-2.5-flash`, có thể thay đổi.
    - `google_ai_studio.basePrompt`: Prompt cho trợ lý AI (tiếng Việt, có thể tùy chỉnh).

    Ví dụ sử dụng:

    ```typescript
    import appConfig from './src/app.config';
    const apiUrl = appConfig.api.getFullApiUrl();
    ```

---

## Công nghệ

-   Sử dụng [Google AI Studio](https://ai.google.dev/) để giao tiếp với AI.
-   Thay đổi model AI trong [`src/app.config.ts`](../src/app.config.ts).

---

## Lưu ý

Đây là phiên bản v1 được thiết kế nhanh theo dạng MVP nên còn nhiều hạn chế.
