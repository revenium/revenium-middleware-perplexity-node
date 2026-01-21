# Revenium Middleware for Perplexity

A lightweight, production-ready middleware that adds **Revenium metering and tracking** to Perplexity AI API calls.

[![npm version](https://img.shields.io/npm/v/@revenium/perplexity.svg)](https://www.npmjs.com/package/@revenium/perplexity)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-revenium.io-blue)](https://docs.revenium.io)
[![Website](https://img.shields.io/badge/website-revenium.ai-blue)](https://www.revenium.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Automatic Metering** - Tracks all API calls with detailed usage metrics
- **Streaming Support** - Full support for streaming responses
- **TypeScript First** - Built with TypeScript, includes full type definitions
- **Multi-Format** - Supports both ESM and CommonJS
- **Custom Metadata** - Add custom tracking metadata to any request
- **Production Ready** - Battle-tested and optimized for production use

## Getting Started

### Quick Start

```bash
npm install @revenium/perplexity
```

**Note:** The `dotenv` package is optional. The middleware automatically loads `.env` files via `Initialize()`.

For complete setup instructions, TypeScript patterns, and usage examples, see [examples/README.md](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/README.md).

### Step-by-Step Guide

The following guide walks you through creating a new project from scratch:

#### Step 1: Create Your Project

```bash
# Create project directory
mkdir my-perplexity-project
cd my-perplexity-project

# Initialize npm project
npm init -y
```

#### Step 2: Install Dependencies

```bash
# Install Revenium middleware
npm install @revenium/perplexity

# For TypeScript projects (optional)
npm install -D typescript tsx @types/node
```

#### Step 3: Setup Environment Variables

Create a `.env` file in your project root:

```bash
# Create .env file
echo. > .env  # On Windows (CMD)
touch .env    # On Mac/Linux
# OR
# PowerShell
New-Item -Path .env -ItemType File
```

Copy and paste the following into `.env`:

```env
# Perplexity Configuration
PERPLEXITY_API_KEY=pplx_your_perplexity_api_key

# Revenium Configuration
REVENIUM_METERING_API_KEY=hak_your_revenium_api_key

# Optional: For development/testing (defaults to https://api.revenium.ai)
# REVENIUM_METERING_BASE_URL=https://api.revenium.ai

# Optional: Perplexity API base URL (defaults to https://api.perplexity.ai)
# PERPLEXITY_API_BASE_URL=https://api.perplexity.ai

# Optional: Enable debug logging
# REVENIUM_DEBUG=false

# Optional: Terminal cost/metrics summary
# REVENIUM_PRINT_SUMMARY=true  # or 'human' or 'json'
# REVENIUM_TEAM_ID=your_team_id  # Required for cost retrieval
```

**Replace the placeholder values with your actual keys!**

For a complete list of all available environment variables, see the [Configuration Options](#configuration-options) section below.

#### Step 4: Implement in Your Code

Use the examples as reference for implementing the middleware in your project. See [examples/README.md](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/README.md) for complete implementation examples including:

- How to initialize the middleware with your configuration
- Making API calls with automatic metering
- Handling streaming responses
- Adding custom metadata to track business context

**Note for ESM projects:** If you get a "Cannot use import statement outside a module" error, make sure your `package.json` includes `"type": "module"`:

```json
{
  "name": "my-perplexity-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@revenium/perplexity": "^2.0.0"
  }
}
```

---

## Running Examples from Cloned Repository

If you've cloned this repository from GitHub and want to **run the included examples** to see how the middleware works (without modifying the middleware source code):

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Configure environment variables
cp .env.example .env      # On Mac/Linux
copy .env.example .env    # On Windows (CMD)
# OR PowerShell
Copy-Item .env.example .env

# Edit .env with your API keys
```

### Run Examples

**Using npm scripts:**

```bash
npm run example:getting-started  # Getting started example
npm run example:basic            # Basic chat completion
npm run example:stream           # Streaming response
npm run example:metadata         # Custom metadata
npm run example:advanced         # Advanced features
```

**Or use npx tsx directly:**

```bash
npx tsx examples/getting_started.ts
npx tsx examples/basic.ts
npx tsx examples/stream.ts
npx tsx examples/metadata.ts
npx tsx examples/advanced.ts
```

For detailed information about each example, see [examples/README.md](examples/README.md).

---

## Local Development and Contributing

For information on modifying the middleware source code, development workflow, and contributing to the project, see:

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete development guide, build system, and testing
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines and process

---

## What Gets Tracked

The middleware automatically captures comprehensive usage data:

### **Usage Metrics**

- **Token Counts** - Input tokens, output tokens, total tokens
- **Model Information** - Model name, provider (Perplexity)
- **Request Timing** - Request duration, response time
- **Cost Calculation** - Estimated costs based on current pricing

### **Business Context (Optional)**

- **User Tracking** - Subscriber ID, email, credentials
- **Organization Data** - Organization ID, subscription ID, product ID
- **Task Classification** - Task type, agent identifier, trace ID
- **Quality Metrics** - Response quality scores, task identifiers

### **Technical Details**

- **API Endpoints** - Chat completions
- **Request Types** - Streaming vs non-streaming
- **Error Tracking** - Failed requests, error types, retry attempts
- **Environment Info** - Development vs production usage

## Metadata Fields

The following table shows all fields this middleware sends to the Revenium API:

| Field                   | Type    | Required  | Description                                        |
| ----------------------- | ------- | --------- | -------------------------------------------------- |
| **Core Fields**         |         |           |                                                    |
| `model`                 | string  | Yes       | Perplexity model name (e.g., "sonar-pro")          |
| `provider`              | string  | Yes       | Always "Perplexity"                                |
| `inputTokenCount`       | integer | Yes       | Number of input tokens consumed                    |
| `outputTokenCount`      | integer | Yes       | Number of output tokens generated                  |
| `totalTokenCount`       | integer | Yes       | Total tokens (input + output)                      |
| `requestDuration`       | integer | Yes       | Request duration in milliseconds                   |
| **Timing**              |         |           |                                                    |
| `requestTime`           | string  | Auto      | ISO 8601 timestamp when request started            |
| `responseTime`          | string  | Auto      | ISO 8601 timestamp when response completed         |
| `completionStartTime`   | string  | Auto      | ISO 8601 timestamp when completion started         |
| `timeToFirstToken`      | integer | Streaming | Time to first token in ms (streaming only)         |
| **Request Details**     |         |           |                                                    |
| `transactionId`         | string  | Auto      | Unique transaction identifier                      |
| `operationType`         | string  | Auto      | Always "CHAT" for chat completions                 |
| `stopReason`            | string  | Auto      | Completion finish reason ("END", "STOP", etc.)     |
| `isStreamed`            | boolean | Auto      | Whether response was streamed                      |
| `costType`              | string  | Auto      | Always "AI"                                        |
| `modelSource`           | string  | Auto      | Always "PERPLEXITY"                                |
| `middlewareSource`      | string  | Auto      | Always "revenium-perplexity-node"                  |
| **Cost Information**    |         |           |                                                    |
| `inputTokenCost`        | number  | Optional  | Cost for input tokens (if provided by Perplexity)  |
| `outputTokenCost`       | number  | Optional  | Cost for output tokens (if provided by Perplexity) |
| `totalCost`             | number  | Optional  | Total cost (if provided by Perplexity)             |
| **Business Context**    |         |           |                                                    |
| `organizationId`        | string  | Optional  | Your organization identifier                       |
| `productId`             | string  | Optional  | Your product identifier                            |
| `subscriptionId`        | string  | Optional  | Your subscription identifier                       |
| `taskType`              | string  | Optional  | Type of AI task (e.g., "chat", "research")         |
| `traceId`               | string  | Optional  | Session or conversation tracking ID                |
| `agent`                 | string  | Optional  | AI agent or bot identifier                         |
| `responseQualityScore`  | number  | Optional  | Custom quality rating (0.0-1.0)                    |
| `subscriber.id`         | string  | Optional  | User identifier                                    |
| `subscriber.email`      | string  | Optional  | User email address                                 |
| `subscriber.credential` | object  | Optional  | Authentication credential (name, value)            |

**Notes:**

- **Required** fields are always sent with every request
- **Auto** fields are automatically populated by the middleware
- **Optional** fields are only sent if you provide them via `usageMetadata`
- **Streaming** fields are only sent for streaming requests

**Reference:**

- [API Reference](https://revenium.readme.io/reference/meter_ai_completion) - Complete metadata field documentation

## Trace Visualization Fields

The middleware automatically captures trace visualization fields for distributed tracing and analytics:

| Field                 | Type   | Description                                                                     | Environment Variable               |
| --------------------- | ------ | ------------------------------------------------------------------------------- | ---------------------------------- |
| `environment`         | string | Deployment environment (production, staging, development)                       | `REVENIUM_ENVIRONMENT`, `NODE_ENV` |
| `operationType`       | string | Operation classification (CHAT, EMBED, etc.) - automatically detected           | N/A (auto-detected)                |
| `operationSubtype`    | string | Additional detail (function_call, etc.) - automatically detected                | N/A (auto-detected)                |
| `retryNumber`         | number | Retry attempt number (0 for first attempt, 1+ for retries)                      | `REVENIUM_RETRY_NUMBER`            |
| `parentTransactionId` | string | Parent transaction reference for distributed tracing                            | `REVENIUM_PARENT_TRANSACTION_ID`   |
| `transactionName`     | string | Human-friendly operation label                                                  | `REVENIUM_TRANSACTION_NAME`        |
| `region`              | string | Cloud region (us-east-1, etc.) - auto-detected from AWS/Azure/GCP               | `AWS_REGION`, `REVENIUM_REGION`    |
| `credentialAlias`     | string | Human-readable credential name                                                  | `REVENIUM_CREDENTIAL_ALIAS`        |
| `traceType`           | string | Categorical identifier (alphanumeric, hyphens, underscores only, max 128 chars) | `REVENIUM_TRACE_TYPE`              |
| `traceName`           | string | Human-readable label for trace instances (max 256 chars)                        | `REVENIUM_TRACE_NAME`              |

**All trace visualization fields are optional.** The middleware will automatically detect and populate these fields when possible.

### Example Configuration

```env
REVENIUM_ENVIRONMENT=production
REVENIUM_REGION=us-east-1
REVENIUM_CREDENTIAL_ALIAS=Perplexity Production Key
REVENIUM_TRACE_TYPE=customer_support
REVENIUM_TRACE_NAME=Support Ticket #12345
REVENIUM_PARENT_TRANSACTION_ID=parent-txn-123
REVENIUM_TRANSACTION_NAME=Answer Customer Question
REVENIUM_RETRY_NUMBER=0
```

For a complete example, see [`.env.example`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/.env.example).

## Prompt Capture

The middleware can capture prompts and responses for analysis. This feature is **disabled by default** for privacy.

### Configuration

Enable prompt capture using environment variables, programmatic configuration, or per-call metadata:

**Environment Variables:**

```bash
export REVENIUM_CAPTURE_PROMPTS=true
export REVENIUM_MAX_PROMPT_SIZE=50000
```

**Programmatic Configuration:**

```typescript
import { Initialize } from "@revenium/perplexity";

Initialize({
  reveniumApiKey: "hak_your_key",
  reveniumBaseUrl: "https://api.revenium.ai",
  perplexityApiKey: "pplx_your_key",
  capturePrompts: true,
  maxPromptSize: 50000,
});
```

**Per-Call Override:**

```typescript
const response = await client.chat.completions.create(
  {
    model: "llama-3.1-sonar-small-128k-online",
    messages: [{ role: "user", content: "Hello" }],
  },
  {
    usageMetadata: { capturePrompts: true },
  },
);
```

### Configuration Priority

The middleware uses the following priority order (highest to lowest):

1. Per-call `usageMetadata.capturePrompts`
2. Programmatic `config.capturePrompts`
3. Environment variable `REVENIUM_CAPTURE_PROMPTS`
4. Default: `false`

### Security

All captured prompts are automatically sanitized to remove sensitive credentials:

- Perplexity API keys (pplx-\*)
- OpenAI keys (sk-\*, sk-proj-\*, sk-ant-\*)
- AWS access keys (AKIA\*)
- GitHub tokens (ghp*\*, ghs*\*)
- JWT tokens
- Bearer tokens
- Generic API keys, tokens, passwords, secrets

Prompts exceeding `maxPromptSize` (default: 50000 characters) are automatically truncated with a flag indicating truncation.

## Terminal Cost/Metrics Summary

The middleware can print a cost and metrics summary to your terminal after each API request. This is useful for development and debugging.

### Configuration

Enable terminal summary output using environment variables or programmatic configuration:

**Environment Variables:**

```bash
# Enable human-readable summary (default format)
export REVENIUM_PRINT_SUMMARY=true

# Or specify format explicitly
export REVENIUM_PRINT_SUMMARY=human  # Human-readable format
export REVENIUM_PRINT_SUMMARY=json   # JSON format for log parsing

# Optional: Set team ID to fetch cost data
export REVENIUM_TEAM_ID=your_team_id
```

**Programmatic Configuration:**

```typescript
import { Initialize } from "@revenium/perplexity";

Initialize({
  reveniumApiKey: "hak_your_api_key",
  reveniumBaseUrl: "https://api.revenium.ai",
  perplexityApiKey: "pplx_your_api_key",
  printSummary: true, // or 'human' or 'json'
  teamId: "your_team_id", // Optional: for cost retrieval
});
```

### Output Formats

**Human-readable format** (`printSummary: true` or `printSummary: 'human'`):

```
============================================================
📊 REVENIUM USAGE SUMMARY
============================================================
🤖 Model: sonar-pro
🏢 Provider: Perplexity
⏱️  Duration: 1.23s

💬 Token Usage:
   📥 Input Tokens:  150
   📤 Output Tokens: 75
   📊 Total Tokens:  225

💰 Cost: $0.004500
🔖 Trace ID: trace-abc-123
============================================================
```

**JSON format** (`printSummary: 'json'`):

```json
{
  "model": "sonar-pro",
  "provider": "Perplexity",
  "durationSeconds": 1.23,
  "inputTokenCount": 150,
  "outputTokenCount": 75,
  "totalTokenCount": 225,
  "cost": 0.0045,
  "traceId": "trace-abc-123"
}
```

### Cost Retrieval

- **Without `teamId`**: Shows token counts and duration, displays hint to set `REVENIUM_TEAM_ID`
- **With `teamId`**: Fetches actual cost from Revenium API with automatic retry logic
- **Cost pending**: Shows "(pending aggregation)" if cost data isn't available yet
- **Fire-and-forget**: Never blocks your application, even if cost fetch fails

## API Overview

- **`Initialize(config?)`** - Initialize the middleware (from environment or explicit config)
- **`GetClient()`** - Get the global Revenium client instance
- **`Configure(config)`** - Alias for `Initialize()` for programmatic configuration
- **`IsInitialized()`** - Check if the middleware is initialized
- **`Reset()`** - Reset the global client (useful for testing)

**For complete API documentation and usage examples, see [`examples/README.md`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/README.md).**

## Configuration Options

### Environment Variables

For a complete list of all available environment variables with examples, see [`.env.example`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/.env.example).

## Examples

The package includes comprehensive examples in the [`examples/`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/) directory.

## Project Structure

```
revenium-middleware-perplexity-node/
├── src/
│   ├── core/
│   │   ├── client/          # Client manager (Initialize/GetClient)
│   │   ├── config/           # Configuration management
│   │   ├── middleware/       # Perplexity API middleware wrapper
│   │   ├── providers/        # Provider detection
│   │   └── tracking/         # Metering and tracking
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── index.ts              # Main entry point
├── examples/                 # TypeScript examples
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Initialize**: Call `Initialize()` to set up the middleware with your configuration
2. **Get Client**: Call `GetClient()` to get a wrapped Perplexity client instance
3. **Make Requests**: Use the client normally - all requests are automatically tracked
4. **Async Tracking**: Usage data is sent to Revenium in the background (fire-and-forget)
5. **Transparent Response**: Original Perplexity responses are returned unchanged

The middleware never blocks your application - if Revenium tracking fails, your Perplexity requests continue normally.

**Supported APIs:**

- Chat Completions API (`client.chat().completions().create()`)
- Streaming API (`client.chat().completions().createStreaming()`)

## Troubleshooting

### Common Issues

**No tracking data appears:**

1. Verify environment variables are set correctly in `.env`
2. Enable debug logging by setting `REVENIUM_DEBUG=true` in `.env`
3. Check console for `[Revenium]` log messages
4. Verify your `REVENIUM_METERING_API_KEY` is valid

**Client not initialized error:**

- Make sure you call `Initialize()` before `GetClient()`
- Check that your `.env` file is in the project root
- Verify `REVENIUM_METERING_API_KEY` is set

**Perplexity API errors:**

- Verify `PERPLEXITY_API_KEY` is set correctly
- Check that your API key starts with `pplx-`
- Ensure you're using a valid model name

**Windows-specific issues:**

If you're developing on Windows and encounter build errors with `npm run clean`:

- The `clean` script uses `rm -rf` which may not work in Windows CMD
- Use PowerShell or Git Bash instead
- Or manually delete the `dist` folder before building
- Alternatively, install `rimraf` globally: `npm install -g rimraf` and update the script to use `rimraf dist`

### Debug Mode

Enable detailed logging by adding to your `.env`:

```env
REVENIUM_DEBUG=true
```

### Getting Help

If issues persist:

1. Enable debug logging (`REVENIUM_DEBUG=true`)
2. Check the [`examples/`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/) directory for working examples
3. Review [`examples/README.md`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/README.md) for detailed setup instructions
4. Contact support@revenium.io with debug logs

## Supported Models

This middleware works with any Perplexity model. For the complete model list, see the [Perplexity Models Documentation](https://docs.perplexity.ai/getting-started/models).

### API Support Matrix

The following table shows what has been tested and verified with working examples:

| Feature               | Chat Completions | Streaming |
| --------------------- | ---------------- | --------- |
| **Basic Usage**       | Yes              | Yes       |
| **Metadata Tracking** | Yes              | Yes       |
| **Token Counting**    | Yes              | Yes       |

**Note:** "Yes" = Tested with working examples in [`examples/`](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/examples/) directory

## Requirements

- Node.js 20+
- TypeScript 5.0+ (for TypeScript projects)
- Revenium API key
- Perplexity API key

## Documentation

For detailed documentation, visit [docs.revenium.io](https://docs.revenium.io)

## Contributing

See [CONTRIBUTING.md](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/CONTRIBUTING.md)

## Code of Conduct

See [CODE_OF_CONDUCT.md](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/CODE_OF_CONDUCT.md)

## Security

See [SECURITY.md](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/SECURITY.md)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/LICENSE) file for details.

## Support

For issues, feature requests, or contributions:

- **GitHub Repository**: [revenium/revenium-middleware-perplexity-node](https://github.com/revenium/revenium-middleware-perplexity-node)
- **Issues**: [Report bugs or request features](https://github.com/revenium/revenium-middleware-perplexity-node/issues)
- **Documentation**: [docs.revenium.io](https://docs.revenium.io)
- **Contact**: Reach out to the Revenium team for additional support

---

**Built by Revenium**
