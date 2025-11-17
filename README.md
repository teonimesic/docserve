# docserve

Fast markdown documentation server with **live reload**, **recursive folder support**, and **theme switching**.

> **Note**: This project is based on [mdserve](https://github.com/some-natalie/mdserve) but has evolved significantly with a complete React frontend rewrite, recursive folder watching, and enhanced UI features.

Just run `docserve docs/` and start writing. One statically-compiled executable with embedded React SPA - no installation, no dependencies.

## Features

- ⚡ **Instant Live Reload** - Real-time updates via WebSocket when markdown files change
- 📁 **Recursive Folder Support** - Automatically watches all subdirectories and nested markdown files
- 🌲 **Collapsible File Tree** - Navigate nested documentation with an interactive sidebar
- 🎨 **5 Built-in Themes** - Light, Dark, and Catppuccin variants with localStorage persistence
- 📝 **GitHub Flavored Markdown** - Full GFM support including tables, strikethrough, code blocks, and task lists
- 📊 **Mermaid Diagrams** - Automatic rendering of flowcharts, sequence diagrams, class diagrams, and more
- 🔗 **Smart Link Navigation** - Relative markdown links work seamlessly without page reloads
- 🖱️ **Resizable Sidebar** - Drag to resize or collapse the sidebar to your preference
- ✅ **Interactive Checkboxes** - Check/uncheck task list items directly in the UI (saves to file)
- 🚀 **Fast & Lightweight** - Rust backend + React SPA with client-side markdown rendering

## Architecture

**Backend**: Rust (Axum) - HTTP server, WebSocket live reload, recursive file watching

**Frontend**: React SPA (TypeScript) - Client-side markdown parsing with marked.js, theme management, interactive file tree

**Build**: Single binary with embedded frontend assets (~2MB) via rust-embed

See [Architecture Documentation](docs/architecture.md) for detailed information.

## Installation

### From npm (Recommended)

```bash
npm install -g docserve
```

### Using Cargo

```bash
cargo install docserve
```

### From Source

```bash
git clone https://github.com/teonimesic/docserve.git
cd docserve
cd frontend && npm install && npm run build && cd ..
cargo build --release
cp target/release/docserve <folder in your PATH>
```

### Manual Download

Download the appropriate binary for your platform from the [latest release](https://github.com/teonimesic/docserve/releases/latest).

## Usage

### Basic Usage

```bash
# Serve all markdown files in a directory (recursive)
docserve docs/

# Serve on custom port
docserve docs/ --port 8080
docserve docs/ -p 8080

# Serve on custom hostname and port
docserve docs/ --hostname 0.0.0.0 --port 8080
```

### Directory Mode

When you pass a directory path, docserve automatically:
- Scans and serves all `.md` and `.markdown` files **recursively** in subdirectories
- Displays an interactive navigation sidebar with collapsible folders
- Watches for file changes, additions, and deletions in real-time
- Preserves folder expansion state and sidebar preferences in localStorage

**Note**: Single-file mode is not currently supported. Place your markdown file in a directory to serve it.

## API Endpoints

Once running, the server provides (default: [http://localhost:3000](http://localhost:3000)):

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Serve React SPA |
| GET | `/api/files` | List all markdown files (recursive) |
| GET | `/api/files/{path}` | Get markdown file content |
| PUT | `/api/files/{path}` | Update file content (checkbox editing) |
| GET | `/api/static/{path}` | Serve static files (images, etc.) |
| GET | `/ws` | WebSocket connection for live reload |
| GET | `/__health` | Health check endpoint |

## Theme System

**Built-in Theme Selector**
- Click the 🎨 button in the top-right corner to open theme selector
- **5 Available Themes**:
  - **Light**: Clean, bright theme optimized for readability
  - **Dark**: GitHub-inspired dark theme with comfortable contrast
  - **Catppuccin Latte**: Warm light theme with soothing pastels
  - **Catppuccin Macchiato**: Cozy mid-tone theme with rich colors
  - **Catppuccin Mocha**: Deep dark theme with vibrant accents (default)
- **Persistent Preference**: Your theme choice is automatically saved in browser localStorage

## Development

### Prerequisites

- Rust 1.85+ (2024 edition)
- Node.js 18+ and npm (for frontend development)

### Building

```bash
# Build frontend first (outputs to frontend/dist)
cd frontend
npm install
npm run build
cd ..

# Build Rust binary (embeds frontend/dist)
cargo build --release

# Run the binary
./target/release/docserve test_folders/
```

### Running Tests

#### Backend Tests (Rust)

```bash
# Run all Rust tests
cargo test

# Run integration tests only
cargo test --test integration_test

# Run with coverage (requires llvm-cov)
cargo llvm-cov --html
```

**Coverage**: Backend maintains **>90% test coverage** with comprehensive integration tests.

#### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run unit tests (Vitest)
npm run test

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests (Playwright)
npm run test:e2e
```

**Coverage**: Frontend maintains **>88% overall coverage** with:
- React hooks (100% coverage)
- UI components (99.44% coverage)
- 17 comprehensive E2E tests (Playwright)

## Differences from Original mdserve

| Feature | Original mdserve | docserve |
|---------|------------------|----------|
| Frontend | Server-side Jinja2 templates | React SPA |
| Markdown Rendering | Server-side (pulldown-cmark) | Client-side (marked.js) |
| Folder Support | Flat only | Recursive with nested folders |
| Single File Mode | Supported | Not currently supported |
| File Caching | In-memory HTML cache | No caching (read on demand) |
| Navigation | Server-generated links | Client-side SPA routing |
| Theme Persistence | None | localStorage with 5 themes |
| Binary Size | ~500KB | ~2MB (includes React) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Maintainer

**Stefano Benatti** - [teonimesic](https://github.com/teonimesic)

## Acknowledgments

- Based on [mdserve](https://github.com/some-natalie/mdserve) by @some-natalie
- Built with [Axum](https://github.com/tokio-rs/axum) web framework
- React frontend with [Vite](https://vitejs.dev/) build tool
- Markdown parsing by [marked.js](https://marked.js.org/)
- Diagram rendering by [Mermaid.js](https://mermaid.js.org/)
- [Catppuccin](https://catppuccin.com/) color themes
