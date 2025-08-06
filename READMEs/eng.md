# My Wallet - Personal Expense Management with AI

## Table of Contents

-   [English](#english)
-   [Tiếng Việt](vn.md)

---

## English

This is a simple web application for managing personal expenses, using AI to analyze and record transactions from natural language descriptions.

---

## Quick Setup

1. **Environment Variables**

    Copy `.env.example` to `.env` and fill in your credentials:

    ```bash
    GOOGLE_AI_STUDIO_API_KEY=your_GOOGLE_AI_STUDIO_API_KEY_here
    MONGODB_URI=your_mongodb_uri_here
    NEXT_PUBLIC_API_BASE_URL=https://your-deployed-api-url.com/
    ```

    - `GOOGLE_AI_STUDIO_API_KEY`: Your API key from [Google AI Studio](https://ai.google.dev/).
    - `MONGODB_URI`: Your MongoDB connection string.
    - `NEXT_PUBLIC_API_BASE_URL`: The base URL for your API (use your deployed URL for production, or leave blank for local development).

2. **Configuration File**

    The main configuration is in [`src/app.config.ts`](../src/app.config.ts):

    - `api.baseUrl`: Uses `NEXT_PUBLIC_API_BASE_URL` in production, or `http://localhost:3000/` in development.
    - `google_ai_studio.apiKey`: Reads from your environment variable.
    - `google_ai_studio.model`: Default is `gemini-2.5-flash`, you can change it as needed.
    - `google_ai_studio.basePrompt`: The prompt for the AI assistant (in Vietnamese, can be customized).

    Example usage:

    ```typescript
    import appConfig from './src/app.config';
    const apiUrl = appConfig.api.getFullApiUrl();
    ```

---

## Technologies

-   Uses [Google AI Studio](https://ai.google.dev/) for AI interaction.
-   Change AI model in [`src/app.config.ts`](../src/app.config.ts).

---

## Note

This is version v1, quickly designed as an MVP, so there are still many limitations.
