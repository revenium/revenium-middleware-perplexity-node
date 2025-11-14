# Revenium Perplexity Middleware - Examples

This directory contains examples demonstrating how to use the Revenium Perplexity middleware.

## Prerequisites

Before running the examples, make sure you have:

1. **Node.js 20+** installed
2. **Revenium API Key** - Get one from [Revenium Dashboard](https://app.revenium.ai)
3. **Perplexity API Key** - Get one from [Perplexity Platform](https://www.perplexity.ai)

## Setup

Choose one of the following approaches:

### Option 1: Create a New Project (Recommended)

Follow the step-by-step guide below to create a new project and install the middleware from npm.

### Option 2: Clone the Repository (Optional)

If you want to explore the source code or contribute to the project:

```bash
git clone https://github.com/revenium/revenium-middleware-perplexity-node.git
cd revenium-middleware-perplexity-node
npm install
npm run build
```

Then skip to [Step 3: Environment Setup](#3-environment-setup) below.

---

## Getting Started - Step by Step

### 1. Create Your Project

```bash
# Create project directory
mkdir my-perplexity-project
cd my-perplexity-project

# Initialize Node.js project
npm init -y
```

### 2. Install Dependencies

```bash
npm install @revenium/perplexity openai
npm install -D typescript tsx @types/node  # For TypeScript
```

### 3. Environment Setup

Create a `.env` file in the project root with your API keys:

```bash
# Required
REVENIUM_METERING_API_KEY=hak_your_revenium_api_key
PERPLEXITY_API_KEY=pplx_your_perplexity_api_key

# Optional
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
PERPLEXITY_API_BASE_URL=https://api.perplexity.ai
REVENIUM_DEBUG=false
```

### 4. Run Examples

**If you cloned from GitHub:**

```bash
# Run examples directly (or use npm run example:<name> scripts)
npx tsx examples/getting_started.ts
npx tsx examples/basic.ts
npx tsx examples/metadata.ts
npx tsx examples/stream.ts
npx tsx examples/advanced.ts
```

**If you installed via npm:**

Examples are included in your `node_modules/@revenium/perplexity/examples/` directory:

```bash
npx tsx node_modules/@revenium/perplexity/examples/getting_started.ts
npx tsx node_modules/@revenium/perplexity/examples/basic.ts
npx tsx node_modules/@revenium/perplexity/examples/metadata.ts
npx tsx node_modules/@revenium/perplexity/examples/stream.ts
npx tsx node_modules/@revenium/perplexity/examples/advanced.ts
```

## Examples

### 1. Getting Started

**File:** `getting_started.ts`

The simplest example to get you started with Revenium tracking:

- Initialize the middleware
- Create a basic chat completion
- Display response and usage metrics

**Run:**

```bash
npx tsx examples/getting_started.ts
```

**What it does:**

- Loads configuration from environment variables
- Creates a simple chat completion request
- Automatically sends metering data to Revenium API
- Displays the response

---

### 2. Basic Usage

**File:** `basic.ts`

Demonstrates standard Perplexity API usage:

- Chat completions with metadata
- Simple metadata tracking

**Run:**

```bash
npx tsx examples/basic.ts
```

**What it does:**

- Creates chat completions with metadata tracking
- Demonstrates basic metadata usage

---

### 3. Metadata

**File:** `metadata.ts`

Demonstrates all available metadata fields:

- Complete metadata structure
- All optional fields documented
- Subscriber information

**Run:**

```bash
npx tsx examples/metadata.ts
```

**What it does:**

- Shows all available metadata fields
- Demonstrates subscriber tracking
- Includes organization and product tracking

**Metadata fields supported:**

- `traceId` - Session or conversation tracking identifier
- `taskType` - Type of AI task being performed
- `agent` - AI agent or bot identifier
- `organizationId` - Organization identifier
- `productId` - Product or service identifier
- `subscriptionId` - Subscription tier identifier
- `responseQualityScore` - Quality rating (0.0-1.0)
- `subscriber` - Nested subscriber object with `id`, `email`, `credential` (with `name` and `value`)

---

### 4. Streaming

**File:** `stream.ts`

Demonstrates streaming responses:

- Real-time token streaming
- Accumulating responses
- Streaming metrics

**Run:**

```bash
npx tsx examples/stream.ts
```

**What it does:**

- Creates a streaming chat completion
- Displays tokens as they arrive in real-time
- Tracks streaming metrics
- Sends metering data after stream completes

---

### 5. Advanced Features

**File:** `advanced.ts`

Demonstrates advanced Perplexity features:

- Multi-turn conversations
- Different temperature settings
- Multiple Perplexity models

**Run:**

```bash
npx tsx examples/advanced.ts
```

**What it does:**

- Demonstrates multi-turn conversation with system prompt
- Shows creative responses with higher temperature
- Uses sonar-reasoning model for complex reasoning tasks

---

## Common Issues

### "Client not initialized" error

**Solution:** Make sure to call `Initialize()` before using `GetClient()`.

### "REVENIUM_METERING_API_KEY is required" error

**Solution:** Set the `REVENIUM_METERING_API_KEY` environment variable in your `.env` file.

### "invalid Revenium API key format" error

**Solution:** Revenium API keys should start with `hak_`. Check your API key format.

### Environment variables not loading

**Solution:** Make sure your `.env` file is in the project root directory and contains the required variables.

### Perplexity API errors

**Solution:** Make sure you have set `PERPLEXITY_API_KEY` in your `.env` file and that it starts with `pplx-`.

### Debug Mode

Enable detailed logging to troubleshoot issues:

```bash
# In .env file
REVENIUM_DEBUG=true

# Then run examples
npm run example:getting-started
```

## Next Steps

- Check the [main README](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/README.md) for detailed documentation
- Visit the [Revenium Dashboard](https://app.revenium.ai) to view your metering data
- See [.env.example](https://github.com/revenium/revenium-middleware-perplexity-node/blob/HEAD/.env.example) for all configuration options

## Support

For issues or questions:

- Documentation: https://docs.revenium.io
- Email: support@revenium.io
