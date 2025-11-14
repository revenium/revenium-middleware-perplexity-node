# Development Guide - Revenium Perplexity Middleware

This guide is for developers working on the @revenium/perplexity package or testing unreleased versions.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** installed
- **Revenium API Key** - Get one from [Revenium Dashboard](https://app.revenium.ai)
- **Perplexity API Key** - Get one from [Perplexity Platform](https://www.perplexity.ai)
- **TypeScript** (optional, for TypeScript development)

## Development Workflow

### Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the project root:
   ```bash
   # Create .env file
   echo. > .env  # On Windows (CMD)
   touch .env    # On Mac/Linux
   # OR PowerShell
   New-Item -Path .env -ItemType File
   ```

   Add your API keys to `.env`:
   ```bash
   PERPLEXITY_API_KEY=pplx_your_perplexity_api_key
   REVENIUM_METERING_API_KEY=hak_your_revenium_api_key
   REVENIUM_METERING_BASE_URL=https://api.revenium.ai  # Optional, defaults to https://api.revenium.ai
   REVENIUM_DEBUG=true  # Optional, enables debug logging
   ```

### Building the Package

```bash
npm run build          # Build all formats (CJS, ESM, Types)
```

**Note for Windows users:** The `clean` script uses `rm -rf` which may not work in Windows CMD. Use PowerShell or Git Bash instead, or manually delete the `dist` folder before building.

### Running Examples

Make sure you have created the `.env` file with your API keys before running examples:

```bash
npm run example:getting-started  # Getting started example
npm run example:basic            # Basic chat completion
npm run example:stream           # Streaming response
npm run example:metadata         # Custom metadata
npm run example:advanced         # Advanced features
```

### Testing Pre-Release Versions

For testing unreleased versions or development builds, you can create a local test project:

#### 1. Clone Repository and Build Package

```bash
# Clone the repository
git clone https://github.com/revenium/revenium-middleware-perplexity-node.git
cd revenium-middleware-perplexity-node

# Build and create package
npm install
npm run build
npm pack
```

#### 2. Create Test Project

```bash
# Create test project in parent directory
cd ..
mkdir revenium-perplexity-test && cd revenium-perplexity-test
npm init -y

# Install the local package
npm install ../revenium-middleware-perplexity-node/revenium-perplexity-*.tgz
```

**Note:** The `dotenv` package is not required as `Initialize()` automatically loads `.env` files.

#### 3. Create Environment File

Create a `.env` file in your test project:

```bash
# Create .env file
echo. > .env  # On Windows (CMD)
touch .env    # On Mac/Linux
# OR PowerShell
New-Item -Path .env -ItemType File
```

Add your environment variables:

```bash
# .env
PERPLEXITY_API_KEY=pplx_your_perplexity_api_key
REVENIUM_METERING_API_KEY=hak_your_revenium_api_key
REVENIUM_METERING_BASE_URL=https://api.revenium.ai  # Optional, defaults to https://api.revenium.ai
REVENIUM_DEBUG=true  # Optional, enables debug logging
```

#### 4. Create Test File

```typescript
// test-basic.ts
import { Initialize, GetClient } from "@revenium/perplexity";

async function test() {
  // Initialize middleware (automatically loads .env file)
  Initialize();

  // Get client
  const client = GetClient();

  // Create chat completion with metadata
  const result = await client.chat().completions().create(
    {
      model: "sonar-pro",
      messages: [{ role: "user", content: "Hello!" }],
    },
    {
      subscriber: { id: "test-user" },
      organizationId: "test-org",
    }
  );

  console.log("Response:", result.choices[0]?.message?.content);
  console.log("Usage:", result.usage);
}

test().catch(console.error);
```

#### 5. Run Test

```bash
# Run the test file (tsx will be automatically installed via npx if needed)
npx tsx test-basic.ts
```

**Note:** The `tsx` package is automatically installed via `npx` if not already available. You can also install it globally with `npm install -g tsx` or as a dev dependency.

## Publishing Checklist

Before publishing a new version:

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Run full build: `npm run build`
4. Verify build was successful (check `dist/` directory exists with all formats)
5. Test with local installation: `npm pack`
6. Verify examples work: `npm run example:basic`
7. Check TypeScript compilation: `npx tsc --noEmit`
8. Run test suite: `npm test`
9. Publish: `npm publish`

## Architecture Notes

The middleware uses a clean architecture with:

- **Dual package support** (CJS + ESM)
- **Synchronous initialization** (no race conditions)
- **Fire-and-forget tracking** (never blocks main flow)
- **TypeScript-first design** with full type safety

## Project Structure

```
src/
├── core/
│   ├── client/          # Client manager (Initialize/GetClient)
│   ├── config/           # Configuration management
│   ├── middleware/       # Perplexity API middleware wrapper
│   ├── providers/        # Provider detection
│   └── tracking/         # Metering and tracking
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── index.ts              # Main entry point
```

## Contributing

When contributing:

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure TypeScript compatibility
5. Test with both CJS and ESM
6. Update CHANGELOG.md