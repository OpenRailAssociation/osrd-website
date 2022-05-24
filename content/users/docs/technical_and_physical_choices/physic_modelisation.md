---
title: "Modélisation physique"
linkTitle: "Modélisation physique"
weight: 20
---

<!-- script to auto-render KaTeX extension -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>

#### Le principe fondamental de la dynamique

Pour calculer l’accélération du train il faut considérer toutes les forces appliquées : $$ \sum \vec{F}=m\vec{a} $$

![Marche](../forces.png?style=train)

- **Traction** : Les valeurs de la force de traction $F_{mot}$ pour chaque position sont dépendantes du type de matériel roulant et de la vitesse $v^{\prime}_x$. La dépendance de la vitesse est exprimée par la courbe effort/vitesse à la jante.

$$ F_{mot}(\vec{v^{\prime}}_x,x^{\prime})=F_{mot}(v^{\prime}_x,x^{\prime}){\vec{e_x}^{\prime}} $$

![Marche](../effort-vitesse.png)

> L'axe **x** représente la vitesse du train en [km/h], l'axe **y**, la valeur de la force de traction en [kN].

- **Freinage** : Les valeurs de la force de freinage $F_{brk}$ dépendent du type de matériel roulant et peuvent être dépendantes de la vitesse ou avoir une valeur constante.

$$ \vec{F_{brk}}(x^{\prime})=-F_{brk}(x^{\prime}){\vec{e_x}^{\prime}} $$

- **Résistance à l'avancement** : Pour modéliser la résistance à l’ avancement du train on utilise la formule de Davis qui prend en compte tous les frottements et la résistance aérodynamique de l’air. La valeur de la resistance à l'avancement dépend de la vitesse $v^{\prime}_x$. Les coefficient $A$, $B$, $C$ dépendent du type de matériel roulant.

$$ \vec{R(v^{\prime}_x)}=-(A+Bv^{\prime}_x+{Cv^{\prime}_x}^2){\vec{e_x}^{\prime}} $$

- **Poids (pentes + virages)** : La force du poids donnée par le produit entre la masse $m$ du train et la constante gravitationnelle $g$ est projectée sur les axes $\vec{e_x}^{\prime}$ et $\vec{e_y}^{\prime}$. Pour la projection, on utilise l'angle $i(x^{\prime})$, qui est calculé à partir de l'angle de déclivité $s(x^{\prime})$ corrigé par un facteur qui prend en compte l'effet du rayon de virage $r(x^{\prime})$.

$$ \vec{P(x^{\prime})}=-mge_y(\vec{x^{\prime}})=-mg\Big[sin\big(i(x^{\prime})\big){\vec{e_x}^{\prime}}+cos\big(i(x^{\prime})\big){\vec{e_y}^{\prime}}\Big] $$
$$ i(x^{\prime})= s(x^{\prime})+\frac{800m}{r(x^{\prime})} $$

- **Réaction du sol** :

$$ \vec{R_{gnd}}=R_{gnd}{\vec{e_y}^{\prime}} $$
