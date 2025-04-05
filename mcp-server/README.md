# MCP Server

This is the server component of the Storm project.

## Prerequisites

- Rust (latest stable version)
- Cargo Make

## Installation

### Installing Cargo Make

To install Cargo Make, run:

```bash
cargo install cargo-make
```

## Development

### Using Cargo Make

Cargo Make is a task runner and build tool for Rust projects. It provides a simple way to run common tasks.

#### Available Tasks

- `cargo make` - Run the default task (build)
- `cargo make build` - Build the project
- `cargo make test` - Run tests
- `cargo make run` - Run the project
- `cargo make clean` - Clean the project
- `cargo make check` - Check the project
- `cargo make lint` - Run linters (clippy and fmt)
- `cargo make fmt` - Format code

#### Examples

```bash
# Build the project
cargo make build

# Run the project
cargo make run

# Run tests
cargo make test

# Format code
cargo make fmt
```

## Project Structure

- `src/` - Source code
- `Cargo.toml` - Project configuration and dependencies
- `Makefile.toml` - Cargo Make configuration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Add your API keys and other configuration

3. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Connecting to Cursor

1. Open Cursor
2. Go to Settings > AI > Model Settings
3. Select "Custom MCP Server"
4. Enter the URL of your MCP server (e.g., `http://localhost:3001`)

## API Endpoints

- `POST /mcp/chat/completions`: Main endpoint for chat completions
- `GET /health`: Health check endpoint

## Extending the Server

To integrate with actual AI models:

1. Modify the `/mcp/chat/completions` endpoint in `src/index.js`
2. Add your model integration code
3. Return responses in the expected format

## License

MIT
