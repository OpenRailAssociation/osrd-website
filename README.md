# OSRD website

## What is OSRD?

This repository is for the website used for communication and documentation about the OSRD project.
To know more about OSRD, check out [OSRD on GitHub](https://github.com/OpenRailAssociation/osrd) or [osrd.fr](https://osrd.fr/en/).

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
# starts hugo using the hugomods/hugo:exts docker image
./hugo.sh server
```

#### Build

```
# by default, it just builds the site
./hugo.sh
```
