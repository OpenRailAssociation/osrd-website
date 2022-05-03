# OSRD WEBSITE

`git clone --recurse-submodules --shallow-submodules git@github.com:DGEXSolutions/osrd-website.git`

**This repository uses submodules. Please read the following carefuly**

If you forgot `--recurse-submodules --shallow-submodules` at clone time, run:

`git submodule update --init --recursive --depth=1`

## Using submodules

If you made some changes in the theme repository, you have to update the submodule:

`git submodule update --remote --depth=1`

If somebody already commited the submodule update, either pull with the proper submodule update flag:

`git pull -r --recurse-submodules`

or update the submodule after the fact:

`git submodule update`

Otherwise, the submodule folder will not be updated.

## Build instructions

- Download hugo and npm
- `npm install`
- `hugo --minify` to make a production build
- `hugo serve` to get a development server

### Installing dependencies on NixOS

 - `nix-shell -p nodePackages.node2nix --command 'node2nix -i package.json --development'`
 - `nix-shell`
