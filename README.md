# My Wallet - AI Orchestrator

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.dot-js&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.dot-js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Dự án nghiên cứu khả năng của **AI Agent** trong vai trò bộ não điều phối logic nghiệp vụ (Orchestrator) thay thế cho các luồng xử lý code truyền thống trong quản lý tài chính cá nhân.

## Concept: AI as Logic Orchestrator

Thay vì viết hàng trăm dòng `if-else` để xử lý logic, dự án này sử dụng **Google Gemini API** như một "Decision Maker". AI không chỉ trả lời văn bản mà còn:

- **Phân loại giao dịch**: Tự động nhận diện danh mục (Ăn uống, Di chuyển, Lương...) từ dữ liệu thô.
- **Điều phối nghiệp vụ**: Quyết định hành động tiếp theo dựa trên input của người dùng.
- **Phân tích ngữ cảnh**: Hiểu ý định của người dùng để trả lời và cập nhật trạng thái ví một cách tự nhiên.

## Tính năng chính

- **AI Classification**: Tự động phân loại các khoản thu chi phức tạp.
- **Real-time Processing**: Xử lý logic thông qua AI Agent.

## Công nghệ sử dụng

Dựa trên cấu hình hệ thống:

- **Frontend/Backend**:
    - `Next.js 15` (App Router)
    - `React 19`
    - `TailwindCSS 4`
    - `Lucide React` & `SweetAlert2`
- **AI & Database**:
    - `Google Generative AI` (@google/genai)
    - `Mongoose` (MongoDB)
- **Runtime**:
    - `Node.js` v20+
    - `TypeScript`

---

Built by C4F
