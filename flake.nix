{
  description = "Documentation for sparky.pet";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          name = "docs-sparky-pet";

          packages = with pkgs; [
            # Task runner
            just

            # Documentation tools
            mdbook
            mdbook-admonish

            # JavaScript/TypeScript runtime for custom tooling
            deno

            # Build tools
            dart-sass
            esbuild

            # Encryption tools
            age
            sops

            # Code formatting
            nixfmt-rfc-style
            prettier
          ];

          shellHook = ''
            echo "Welcome to docs.sparky.pet development environment!"
            echo "Available commands:"
            echo "  just build  - Build documentation"
            echo "  just serve  - Start development server"
            echo "  just clean  - Clean build artifacts"
          '';

          # Environment variables
          ESBUILD_BINARY_PATH = "${pkgs.esbuild}/bin/esbuild";
          DENO_NO_UPDATE_CHECK = "1";
        };
      });
}
