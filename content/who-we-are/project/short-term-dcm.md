---
title: Sillon de dernière minute
linkTitle: Sillon de dernière minute
weight: 40
---

<font color=#aa026d>

### Définition

</font>

Pour définir le sillon de dernière minute (ou STDCM, pour Short Term Digital Capacity Management), nous devons d'abord définir ce qu'est un sillon, ainsi que les acteurs qui entrent en jeu. Un **sillon** correspond à la réservation d'espace/temps sur le réseau. C'est une **EF** (entreprise ferroviaire) qui commande le sillon, et le **GI** (gestionnaire d'infrastructure) qui procure le trajet. Lorsqu'on parle de sillons "normaux", la demande de réservation se fait plusieurs années en amont (A-3), et le GI produit un document dans lequel nous pouvons retrouver toutes les demandes avec leur capacité assignée sur le réseau. La **capacité**, c’est l’ensemble des voies disponibles sur le réseau ferroviaire d'un GI. Elle est partagée entre la capacité commerciale, destinée aux EF, et la capacité travaux, qui comme son nom l'indique, est reservée aux différents travaux prévus sur les voies. Par mesure préventive et pour pouvoir gérer certains aléas (retards, problèmes techniques ou environnementaux), le taux de sillons réservés ne peut pas dépasser 75% de la capacité totale du réseau.

C'est ici que le sillon de dernière minute entre en jeu. Si aucun problème n'est à déplorer, le GI se retrouve avec environ 25% de sa capacité non utilisée. Alors, si une EF a besoin d'un sillon en urgence (entre A-1 et jusqu'à quelques minutes avant le départ du matériel roulant), elle peut faire une demande de STDCM.

<font color=#aa026d>

### Défis et ambitions

</font>

Les STDCM sont actuellement gérés par le guichet capacitaire entre A-1 et J-1, et par le guichet opérationnel à partir de J-1 à 17h. Plusieurs problèmes en découle ; la demande est fastidieuse et la réponse des guichets est asynchrone (prennent plusieurs jours à répondre), les sillons sont tracés à la main (risque d'erreur humaine) et la facturation peut se perdre dans les opérations, on estime à des dizaines de millions d'euros les pertes dûes aux STDCM non facturés. Certains outils numériques savent déjà régler ces problèmes, mais ne prennent pas en compte la gestion de conflit sur le réseau, ou s'ils la prennent, ils ne savent pas la gérer en gare.

C'est pour répondre à ces enjeux qu'est née l'idée de proposer une gestion numérique des sillons de dernière minute. L'objectif est de permettre aux EF de réserver des sillons facilement, en proposant un calcul du STDCM dans la capacité théorique prévisionnelle, et en leur apportant une réponse rapide (environ 3 minutes d'attente). Les clients pourraient aussi choisir entre plusieurs modes de calculs. Cet outil est en cours de développement, et devrait être disponible dans les prochaines années. 
