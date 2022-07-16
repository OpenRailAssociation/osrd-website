# OSRD WEBSITE


## What is OSRD?

OSRD is a work in progress tool meant to help design and operate railway infrastructure.
It's built around a simulator, which evaluates a timetable on a given infrastructure.

It's free and open-source forever!


## Clone

`git clone git@github.com:DGEXSolutions/osrd-website.git`

## Build instructions

### Local

- Install [Node Version Manager](https://github.com/nvm-sh/nvm)
- `nvm install` to set the right node and npm version using nvm
- `npm install` to install all the project dependencies
- `npm run start` to get a development server
- `npm run build` to make a production build

### With docker

#### Development server

```
docker run --rm -it \
  -v $(pwd):/src \
  -p 1313:1313 \
  klakegg/hugo:ext-alpine \
  server
```

#### Build

```
docker run --rm -it \
  -v $(pwd):/src \
  klakegg/hugo:ext-alpine
```

### Gitpod

Click the button below to start a new development environment using Gitpod :

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

### Devcontainer

You can use devcontainer to run this website.
Please read [documentation](https://code.visualstudio.com/docs/remote/create-dev-container) before.

### Codespace

You can use [Codespace](https://fr.github.com/features/codespaces) based on devcontainer to set up a remote development environment and run this website.
For french developers Codespace is still in [beta](https://fr.github.com/features/codespaces).

## Contributing

If you think OSRD doesn't quite fit your needs yet, but still believe it could,
please [tell us about your needs](https://github.com/DGEXSolutions/osrd/issues/new).

Please consider committing resources to help development if you'd like to use OSRD in production.
Code contributions are very welcome, and we'd love to work together to make this project better.


## Contact

You are interested in the project, and you want to know more? Contact us at <contact@osrd.fr>.
