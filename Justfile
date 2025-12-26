# Build documentation
build:
    mdbook build
    @echo "Documentation built to book/ directory"

# Serve documentation locally with live reload
serve:
    mdbook serve --open

# Clean build artifacts
clean:
    mdbook clean
    @echo "Build artifacts cleaned"

# Watch and rebuild on changes
watch:
    mdbook watch

# Run tests (check for broken links, etc)
test:
    mdbook test

# Format nix files
fmt-nix:
    nixfmt flake.nix

# Format all files
fmt: fmt-nix
    prettier --write "**/*.{md,json,css,scss,js,ts}"
    @echo "All files formatted"
