---
title: "Détection de conflits"
linkTitle: "2 - Détection de conflits"
weight: 20
---


Maintenant qu'on sait quels chemins peuvent être utilisés,
on doit déterminer à quel moment ces chemins sont libres.

La documentation (en anglais seulement)
de la détection de conflits explique comment elle est réalisée
en interne. Pour résumer, un train est en conflit avec un autre
quand il observe un signal lui indiquant de ralentir.
Dans notre cas, une solution où cette situation se produit
est considérée comme invalide, le train doit arriver
au signal donné plus tard (ou plus tôt) quand le signal
n'est plus contraignant.


Cependant, la détection de conflit doit être réalisée de
manière *incrémentale*, ce qui veut dire que :
1. Quand une simulation est effectuée jusqu'à t=x, tous les conflits
   qui arrivent avant t=x doivent être connus, *même s'ils sont
   indirectement provoqués par un signal vu à t > x* plus loin sur le chemin.
2. Les conflits et utilisations de ressources doivent être identifiés
   dès qu'ils se produisent, même si le temps de fin d'utilisation n'est
   pas encore défini.


Pour que ce soit possible, on doit être en mesure de savoir où
le train ira *après* la section actuellement simulée (cf
[exploration de l'infrastructure]({{< ref "docs/reference/design-docs/stdcm/pathfinding_module/infrastructure_exploration" >}} "exploration de l'infrastructure")
)

Pour gérer ce cas, le module de détection de conflit
peut renvoyer une erreur quand il est nécessaire d'avoir
plus d'information sur la suite du chemin. Quand ce cas
se produit, les objets `InfraExplorer` sont clonés
pour étendre les chemins.