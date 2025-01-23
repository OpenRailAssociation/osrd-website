---
title: "Install docker"
linkTitle: "Install docker"
weight: 15
---

Regardless of your operating system, docker requires linux to operate. When used on a different
operating system, docker relies on virtual machines to build and run images.

There are two main types of docker installations:
- docker engine is the usual docker command line application
- docker desktop is a GUI app that also manages virtualization

Here's what we suggest:
- If you're on linux, install docker engine [using your package manager](https://docs.docker.com/engine/install/#supported-platforms)
- If you're on MacOS / Windows, install [docker desktop](https://www.docker.com/products/docker-desktop/) if you are allowed to
- If you're on windows and want to get docker running within WSL, or can't use docker desktop, follow the [docker on WSL tutorial](#docker-on-wsl)
- If you're on MacOS and can't use docker desktop, follow the [MacOS colima tutorial](#macos-colima)


## Docker on WSL

This install option is very useful, as it allows having a perfectly normal linux install of docker engine inside WSL, which can still be reached from windows.

- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (If you had an old version of WSL, run `wsl --upgrade`)
- Get an operating system image from the microsoft store (for example, debian or ubuntu)
- [Enable systemd support within the WSL VM](https://learn.microsoft.com/en-us/windows/wsl/systemd)
- Follow the regular [linux install tutorial for docker](https://docs.docker.com/engine/install/#supported-platforms)
- If you have docker desktop installed, you can [configure it to use WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers)


## MacOS colima

This procedure allows installing docker without relying on docker desktop.
It uses colima for virtualizing linux.

1) [Install homebrew](https://brew.sh/)
2) `brew install docker docker-compose colima`
3) Install the compose plugin: `mkdir -p ~/.docker/cli-plugins && ln -sfn $(brew --prefix)/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose`
4) [Configure colima](https://github.com/abiosoft/colima?tab=readme-ov-file#customizing-the-vm):
  - for apple silicon (M1/M2) macbooks: `colima start --cpu 2 --memory 6 --arch aarch64 --vm-type=vz --vz-rosetta --mount-type=virtiofs`
  - for small infrastructures: `colima start --cpu 2 --memory 4`
  - for big infrastructures: `colima start --cpu 2 --memory 6`
5) `brew services start colima` to automatically start colima on startup
6) Exit your terminal, open a new one
7) You can now use docker CLI


{{% alert color="info" %}}
If you're using rancher desktop, please either:
- uninstall the application
- select `Manual` in `Preferences` > `Application` > `Environment`
{{% /alert %}}

{{% alert color="info" %}}
If you get an error at rosetta startup, run `colima delete` and try again (the disk format is not compatible). Settings will be lost.
{{% /alert %}}

{{% alert color="info" %}}
If you get this error: `error getting credentials - err: exec: "docker-credential-osxkeychain": executable file not found in $PATH`

Open `~/.docker/config.json`, and remove `"credsStore": "osxkeychain"`
{{% /alert %}}
