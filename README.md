# ts-workflow-engine-service-1606

A dynamic, region-aware, step-driven **Workflow Engine** built with **Node.js**, **TypeScript**, and **Express**. It is designed to orchestrate configurable workflows with support for features like token validation, OTP verification, notifications, and downstream service calls.

---

## 🚀 Features

- ✅ Dynamic step-based workflow execution
- 🌍 Region-based workflow resolution
- 🔐 Optional token validation
- 📩 Optional OTP flow integration
- 📢 Notification step support
- 📦 Configurable downstream service calls
- 📊 Detailed response metadata:
  - Workflow trace
  - Step timing
  - Request echo
  - Diagnostic codes
  - Config summary

---

## 🧠 Architecture

Each workflow is defined with:
- `steps`: ordered list of actions to be executed
- `config`: optional global settings like tokenCheck, otpFlow, etc.

### Supported Steps

| Step Type             | Description                          |
|-----------------------|--------------------------------------|
| `validateToken`       | Verifies authorization token         |
| `verifyOtp`           | Validates OTP code                   |
| `sendOtpNotification` | Sends OTP to email/mobile            |
| `callExternalService` | Invokes a downstream microservice    |
| `notifyUser`          | Sends a notification                 |
| `customHandler`       | Executes custom logic (if added)     |

---

## 📦 Folder Structure

```bash
ts-workflow-engine-service-1606/
├── workflows/
│   └── step-runner.ts        # Executes each workflow step
├── utils/
│   ├── workflow-loader.ts    # Loads workflow definition
│   ├── response-builder.ts   # Builds success/error response
│   └── logger.ts             # Logger utility
├── types/
│   └── api-response.ts       # API response interfaces
├── routes/
│   └── workflow.route.ts     # Express route for workflow processing
├── index.ts                  # Entry point (Express app)
└── README.md                 # You’re here
