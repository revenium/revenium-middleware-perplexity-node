# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.2] - 2026-02-19

### Added

- Tool metering support (meterTool, reportToolCall, setToolContext)
- outputFields feature for automatic result extraction
- Fetch timeout to sendToolEvent

### Fixed

- Remove dead response.text() in sendToolEvent

## [2.1.1] - 2026-02-06

### Added

- Summary printer with human and JSON output formats
- Region detection from AWS, Azure, GCP environment variables
- Credential alias configuration support
- Trace name and trace type validation
- Retry number tracking

## [2.1.0] - 2026-01-21

### Changed

- Updated credential sanitization patterns from 8 to 13 patterns
- Enhanced security with additional credential types:
  - Anthropic API keys (sk-ant-\*)
  - AWS access keys (AKIA\*)
  - GitHub tokens (ghp*\*, ghs*\*)
  - JWT tokens (eyJ*.eyJ*.\*)
  - Generic secrets pattern
- Improved regex patterns for better credential detection
- Fixed password regex to properly handle quoted values
- Consistent character class patterns across all credential types

### Security

- Enhanced credential sanitization to cover more API key formats
- Improved detection of sensitive data in prompts and responses

## [2.0.9] - 2026-01-06

### Added

- Trace visualization fields support for distributed tracing and analytics
- New trace fields: environment, region, credentialAlias, traceType, traceName, parentTransactionId, transactionName, retryNumber, operationSubtype
- Automatic region detection from AWS/Azure/GCP environment variables with fallback to AWS EC2 metadata service
- Comprehensive unit tests for all trace field functions
- Jest testing infrastructure with full test coverage
- Updated .env.example with trace visualization field examples
- Documentation for trace visualization fields in README.md

### Changed

- buildPayload function is now async to support region detection
- Updated ReveniumPayload interface with trace visualization fields

## [2.0.8] - 2025-11-14

### Changed

- Updated documentation with semver range examples
- Enhanced package structure for better npm distribution
- Improved installation instructions and clarity
- Improved metadata table clarity and accuracy with better field descriptions

### Fixed

- Updated dashboard URL references to app.revenium.ai
- Documentation improvements for better user experience

## [2.0.4] - 2025-10-21

### Changed

- Enhanced package.json with examples in files array
- Added community health files (CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md)
- Updated .gitignore with security report patterns
- Added engines field for Node.js version requirements

## [2.0.3] - 2025-10-17

### Changed

- Documentation improvements with absolute path references

## [2.0.2] - 2025-10-09

### Changed

- Internal updates and improvements

## [2.0.1] - 2025-10-09

### Changed

- Bug fixes and stability improvements

## [2.0.0] - 2025-10-09

### Added

- Complete code restructuring with core/ directory organization
- Dual package exports (ESM + CommonJS) support
- TypeScript declaration maps for better debugging
- Enhanced build system with separate CJS, ESM, and types builds

### Changed

- Restructured src/ directory with core/config, core/tracking, core/wrapper
- Enhanced README with comprehensive documentation

## [1.0.0] - 2025-09-23

### Added

- Initial release of Perplexity AI middleware
- Automatic token counting and usage tracking
- Streaming support with automatic tracking
- Custom metadata integration
- TypeScript support with full type safety
- Comprehensive error handling
- Background processing for non-blocking tracking
- Debug logging support

[2.1.2]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.1.2
[2.1.1]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.1.1
[2.1.0]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.1.0
[2.0.9]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.9
[2.0.8]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.8
[2.0.4]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.4
[2.0.3]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.3
[2.0.2]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.2
[2.0.1]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.1
[2.0.0]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v2.0.0
[1.0.0]: https://github.com/revenium/revenium-middleware-perplexity-node/releases/tag/v1.0.0
