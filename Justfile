# Build documentation
build:
    #!/usr/bin/env bash
    if [ -z "$SOPS_AGE_KEY" ] && [ -f "age-key.txt" ]; then
        export SOPS_AGE_KEY=$(cat age-key.txt | grep "^AGE-SECRET-KEY" | cut -d: -f2 | tr -d ' ')
    fi
    mdbook build
    echo "Documentation built to book/ directory"

# Serve documentation locally with live reload
serve:
    #!/usr/bin/env bash
    if [ -z "$SOPS_AGE_KEY" ] && [ -f "age-key.txt" ]; then
        export SOPS_AGE_KEY=$(cat age-key.txt | grep "^AGE-SECRET-KEY" | cut -d: -f2 | tr -d ' ')
    fi
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

# Encryption commands

# Generate a new encryption key
encryption-keygen:
    deno run -A -r lib/encryptionkey.ts

# Rotate the encryption key
encryption-rotate:
    deno run -A -r lib/encryptionkey.ts

# Encrypt a file with SOPS
encrypt FILE:
    sops --encrypt --in-place {{FILE}}
