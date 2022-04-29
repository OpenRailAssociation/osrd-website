---
title: "Choix techniques"
linkTitle: "Choix techniques"
weight: 30
---

## <font color=#aa026d>Que sont les "enveloppes" ?</font>

L'outil OSRD peut être utilisé pour effectuer deux types de calcul :
- **Simulation de train isolé** où le calcul du temps de circulation est effectué sans interaction entre le train et le système de signalisation.
- **Simulation de plusieurs trains** où une simulation dynamique réelle est exécutée.

Dans les deux cas, pendant la simulation, le train est censé suivre certaines instructions de vitesse. Celles-ci sont modélisées dans OSRD par des courbes espace/vitesse appelées enveloppes. Il existe deux types d'enveloppes :
- Les enveloppes provenant **des données d'infrastructure et de matériel roulant**, comme la vitesse maximale de la ligne et la vitesse maximale du train ; ce sont des entrées de notre calcul et ne sont pas physiquement exactes car elles ne sont pas les résultats d'une intégration réelle des équations physiques du mouvement.
- Enveloppes résultant **d'une intégration réelle** des équations du mouvement physique.

Elles contiennent également des informations sur le temps.
