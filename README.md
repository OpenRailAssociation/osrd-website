# OSRD WEBSITE

## Build instructions

- Download hugo and npm
- `npm install`
- `hugo --minify` to make a production build
- `hugo serve` to get a development server

### Installing dependencies on NixOS

 - `nix-shell -p nodePackages.node2nix --command 'node2nix -i package.json --development'`
 - `nix-shell`