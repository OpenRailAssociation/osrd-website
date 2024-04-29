---
title: "Installer docker"
linkTitle: "Installer docker"
weight: 15
---

Peu importe votre système d'exploitation, docker requiert linux pour fonctionner.
Lorsqu'utilisé sous un autre système d'exploitation, docker a besoin de machines
virtuelles linux pour build et exécuter des images.

Il y a deux types d'installation docker :
- docker engine est l'application en ligne de commande
- docker desktop est une application graphique, qui gère aussi la virtualisation

Voici nos suggestions :
- Si vous êtes sous linux, installez docker engine [via votre gestionnaire de packet](https://docs.docker.com/engine/install/#supported-platforms)
- Si vous êtes sous MacOS / Windows, installez [docker desktop](https://www.docker.com/products/docker-desktop/) si vous y êtes autorisés
- Si vous êtes sous windows, et voulez faire fonctionner docker sous WSL, ou ne pouvez pas utiliser docker desktop, suivez le [guide docker sous WSL](#docker-sous-wsl)
- Si vous êtes sous MacOS, et vous ne pouvez pas utiliser docker desktop, suivez le [guide colima pour MacOS](#macos-colima)


## Docker sous WSL

Cette option d'installation est très utile, car elle permet de disposer d'une installation tout à fait normale de docker engine Linux à l'intérieur de WSL, qui reste accessible depuis Windows.

- [Installez WSL](https://learn.microsoft.com/fr-fr/windows/wsl/install) (Si vous avez une vieille version de WSL, lancez `wsl --upgrade`)
- Obtenez une image WSL depuis le store microsoft (par exemple, debian or ubuntu)
- [Activez le support systemd depuis la VM WSL](https://learn.microsoft.com/fr-fr/windows/wsl/systemd)
- Suivez le [tutoriel d'installation docker engine pour votre distribution WSL](https://docs.docker.com/engine/install/#supported-platforms)
- Si vous avez docker desktop installé, vous pouvez [le configurer pour qu'il utilise WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers)


## MacOS colima

Cette procédure permet d'installer docker sans passer par docker desktop. Elle utilise colima comme solution de virtualisation.

1) [Installez homebrew](https://brew.sh/)
2) `brew install docker docker-compose colima`
3) [Configurez colima](https://github.com/abiosoft/colima?tab=readme-ov-file#customizing-the-vm) :
  - pour des macbooks apple silicon (M1/M2) : `colima start --cpu 2 --memory 6 --arch aarch64 --vm-type=vz --vz-rosetta --mount-type=virtiofs`
  - pour de petites infrastructures: `colima start --cpu 2 --memory 4`
  - pour de grosses infrastructures: `colima start --cpu 2 --memory 6`
4) `brew services start colima` pour lancer automatiquement colima au démarrage
5) Quittez votre terminal, ouvrez-en un nouveau
6) Vous pouvez maintenant utiliser docker CLI


{{% alert color="info" %}}
En cas d'erreur au démarrage avec Rosetta 2, lancez `colima delete` et réessayez (le format de disque n'est pas compatible). Les paramètres seront perdus.
{{% /alert %}}
