{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { nixpkgs
    , flake-utils
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        node = pkgs.nodejs_24;
        nodePackages = pkgs.nodePackages.override {
          nodejs = node;
        };
        hugo = pkgs.hugo;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            node
            nodePackages.npm
            hugo
          ];
        };
      }
    );
}