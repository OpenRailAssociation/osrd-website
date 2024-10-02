# OSRD WEBSITE

## What is OSRD?

OSRD is a work in progress tool meant to help design and operate railway infrastructure.
It's built around a simulator, which evaluates a timetable on a given infrastructure.

It's free and open-source forever!

## Build instructions

### Local

- `npm install` to install all the project dependencies
- `npm run start` to get a development server
- `npm run build` to make a production build

### With docker

#### Download & install hugo image with dependencies

```
docker run --rm -it \
    -v $(pwd):/src \
    --entrypoint npm \
    hugomods/hugo:exts \
    install
```

#### Development server

```
# starts hugo using the klakegg/hugo:ext-alpine docker image
./hugo.sh server --bind=0.0.0.0
```

#### Build

```
# by default, it just builds the site
./hugo.sh
```

## Contributing

If you think OSRD doesn't quite fit your needs yet, but still believe it could,
please [tell us about your needs](https://github.com/OpenRailAssociation/osrd/issues/new?labels=kind%3Aquestion&template=question.yaml).

Please consider committing resources to help development if you'd like to use OSRD in production.
Code contributions are very welcome, and we'd love to work together to make this project better.

For more information on how to contribute, check out the [Contributing file](./CONTRIBUTING.md)

## Get in touch

Send an email at <contact@osrd.fr>, [open an issue](https://github.com/OpenRailAssociation/osrd-website/issues/new), or join the [#public-general:osrd.fr](https://matrix.to/#/#public-general:osrd.fr) matrix channel.