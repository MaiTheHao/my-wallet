# My Wallet - Personal Expense Management with AI

## Table of Contents

-   [English](#english)
-   [Tiếng Việt](#tiếng-việt)

---

## English

This is a simple web application for managing personal expenses, using AI to analyze and record transactions from natural language descriptions.

### Quick Setup

Just set up the environment variables as shown in the `.env.example` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_uri_here
```

### Technologies

-   The app uses [Google AI Studio](https://ai.google.dev/) to interact with AI.
-   You can change the AI model used in [`src/services/AIService.ts`](src/services/AIService.ts) (e.g., `gemini-2.5-flash`).

### Note

This is version v1, quickly designed as an MVP, so there are still many limitations.
