# docs.sparky.pet

User guide and documentation for sparky.

## What is this?

This is a personal user manual - documentation on how to interact with, care for, and understand sparky. Think of it as an operator's manual for a person.

## Development

This project uses:
- **Nix flakes** for reproducible development environment
- **mdBook** for documentation generation
- **Just** for task running

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- That's it! Nix will provide everything else.

### Getting Started

```bash
# Enter the development environment
nix develop

# Start the development server (opens in browser)
just serve

# Build the documentation
just build

# Clean build artifacts
just clean
```

### Without Nix

If you don't have Nix, you'll need to install these tools manually:
- mdBook
- mdbook-admonish
- just

Then run `just serve` or `just build`.

## Project Structure

```
.
├── book.toml          # mdBook configuration
├── flake.nix          # Nix development environment
├── Justfile           # Task runner commands
└── src/               # Documentation source
    ├── README.md      # Introduction
    ├── SUMMARY.md     # Table of contents
    ├── interacting/   # How to interact with sparky
    ├── personal/      # Personal info, hobbies, preferences
    └── reference/     # Quick facts and FAQ
```

## License

This is personal documentation. Please be respectful.
