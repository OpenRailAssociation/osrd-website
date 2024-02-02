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
    klakegg/hugo:ext-alpine \
    install
```

#### Development server

```
docker run --rm -it -v $(pwd):/src -p 1313:1313 klakegg/hugo:ext-alpine server
```

#### Build

```
docker run --rm -it -v $(pwd):/src klakegg/hugo:ext-alpine
```

## Contributing

If you think OSRD doesn't quite fit your needs yet, but still believe it could,
please [tell us about your needs](https://github.com/osrd-project/osrd/issues/new).

Please consider committing resources to help development if you'd like to use OSRD in production.
Code contributions are very welcome, and we'd love to work together to make this project better.


## Contact

You are interested in the project, and you want to know more? Contact us at <contact@osrd.fr>.
