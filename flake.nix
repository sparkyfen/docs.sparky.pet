{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/c374d94f1536013ca8e92341b540eba4c22f9c62";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }@inputs:

    flake-utils.lib.eachDefaultSystem (
      system:
      let
        lib = pkgs.lib;
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          name = "sparkyfen-docs";

          packages = with pkgs; [
            age
            sops
            just
            deno
            dart-sass
            esbuild
            mdbook
            mdbook-admonish
            lowdown

            nixfmt-rfc-style
            nodePackages.prettier
            languagetool
          ];

          ESBUILD_BINARY_PATH = lib.getExe pkgs.esbuild;
          DENO_NO_UPDATE_CHECK = "1";
        };
      }
    );
}
