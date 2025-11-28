# Description

Quand un train s'arrête sur signal fermé, il est possible que le canton précédent
ce signal affiche un aspect plus contraignant que d'ordinaire, en fonction de la
position de l'aiguille suivant le signal fermé.

Il s'agit d'un enclenchement de convergence.

Lorsque l'aiguille en sortie de gare est alignée avec le chemin du train, le signal en entrée
de gare affiche un avertissement.


```
   A        ->           C
-----------------------------
       \                    \\
        ---------------------------
```

Lorsque l'aiguille en sortie de gare n'est pas alignée avec le chemin du train, le signal en entrée
de gare affiche un sémaphore clignotant.


```
   Sc       ->           C
-----------------------------
       \                    _\
        ---------------------------
```

Ce cas de figure n'est important que pour les arrêts sur signal fermé, car dans le cas contraire,
les itinéraires doivent de toute façon être établis suffisamment en avance pour ne pas gêner le train.

# Implémentation

Pour chaque arrêt à signal fermé demandé, une décision doit être prise à l'avance concernant
l'alignement attendu des appareils de voie. Le paramètre par défaut suppose le non-alignement
des appareils de voie.

C'est nécessaire car pour les besoins de la plannification horaire, les trains sont simulés indépendament.
Il n'est pas possible de connaître la position des appareils de voie, et il faut donc spécifier quelle est
leur position attendue, lorsque ça a une importance.
