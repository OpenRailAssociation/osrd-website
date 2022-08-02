---
title: "Modélisation physique"
linkTitle: "1 - Modélisation physique"
weight: 10
---

<!-- script to auto-render KaTeX extension : $$...$$ for outline formula, \\(...\\) for inline formula -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

La modélisation physique joue un rôle important dans le cœur de calcul d'OSRD. C'est elle qui nous permet de simuler la circulation des trains, et elle doit être aussi réaliste que possible.

<font color=#aa026d>

### Bilan des forces

</font>

Pour calculer le déplacement du train au cours du temps, il faut d'abord calculer sa vitesse à chaque instant.
Une manière simple d'obtenir cette vitesse est de passer par le calcul de l'accélération.
Grâce au principe fondamental de la dynamique, l'accélération du train à chaque instant est directement dépendant
des différentes forces qui lui sont appliquées : $$ \sum \vec{F}=m\vec{a} $$

![Marche](../forces.png)

- **Traction** : La valeur de la force de traction \\(F\_{mot}\\) dépend de plusieurs facteurs :

  - du matériel roulant
  - de la vitesse du train \\(v^{\prime}x\\), selon la courbe effort-vitesse ci-dessous :

  $$ {\vec{F_{mot}}(v_{x^{\prime}}, x^{\prime})=F_{mot}(v_{x^{\prime}}, x^{\prime})\vec{e_x^{\prime}}} $$

  ![Marche](../effort-vitesse.png "Exemple de courbe effort-vitesse d'un train")

  > L'axe **x** représente la vitesse du train en [km/h], l'axe **y**, la valeur de la force de traction en [kN].

  - de l'action du conducteur, qui accélère plus ou moins fort en fonction de l'endroit où il se trouve sur son trajet

<br>

- **Freinage** : La valeur de la force de freinage \\(F\_{brk}\\) dépend elle aussi du matériel roulant et de l'action du conducteur mais possède une valeur constante pour un matériel donné. Dans l'état actuel de la modélisation, le freinage est soit nul, soit à sa valeur maximale.

$$ \vec{F_{brk}}(x^{\prime})=-F_{brk}(x^{\prime}){\vec{e\_{x^{\prime}}}} $$

Une seconde approche de la modélisation du freinage est l'approche dite horaire, car utilisée pour la production horaire à la SNCF. Dans ce cas, la décélération est fixe et le freinage ne dépend plus des différentes forces appliquées au train. Les valeurs de décélération typiques vont de 0.4 à 0.7m/s².

<br>

- **Résistance à l'avancement** : Pour modéliser la résistance à l’avancement du train on utilise la formule de Davis qui prend en compte tous les frottements et la résistance aérodynamique de l’air. La valeur de la resistance à l'avancement dépend de la vitesse \\(v^{\prime}\_x\\). Les coefficients \\(A\\), \\(B\\), et \\(C\\) dépendent du matériel roulant.

$$ {\vec{R}(v_{x^{\prime}})}=-(A+Bv_{x^{\prime}}+{Cv_{x^{\prime}}}^2){\vec{e_{x^{\prime}}}} $$

<br>

- **Poids (pentes + virages)** : La force du poids donnée par le produit entre la masse \\(m\\) du train et la constante gravitationnelle \\(g\\) est projetée sur les axes \\(\vec{e_x}^{\prime}\\) et \\(\vec{e_y}^{\prime}\\).Pour la projection, on utilise l'angle \\(i(x^{\prime})\\), qui est calculé à partir de l'angle de déclivité \\(s(x^{\prime})\\) corrigé par un facteur qui prend en compte l'effet du rayon de virage \\(r(x^{\prime})\\).

$$
  \vec{P(x^{\prime})}=-mg\vec{e_y}(x^{\prime})=
  -mg\Big[sin\big(i(x^{\prime})\big){\vec{e_{x^{\prime}}}(x^{\prime})}+cos\big(i(x^{\prime})\big){\vec{e_{{\prime}}}(x^{\prime})}\Big]
$$

$$ i(x^{\prime})= s(x^{\prime})+\frac{800m}{r(x^{\prime})} $$

<br>

- **Réaction du sol** : La force de réaction du sol compense simplement la composante verticale du poids, mais n'a pas d'impact sur la dynamique du train car elle n'a aucune composante selon l'axe \\({\vec{e_x}^{\prime}}\\).

$$ \vec{R_{gnd}}=R_{gnd}{\vec{e\_{y^{\prime}}}} $$

<font color=#aa026d>

### Equilibre des forces

</font>

L'équation du principe fondamental de la dynamique projetée sur l'axe \\({\vec{e_x}^{\prime}}\\) (dans le référentiel du train) donne l'équation scalaire suivante :

$$
a_{x^{\prime}}(t) = \frac{1}{m}\Big
[F_{mot}(v_{x^{\prime}}, x^{\prime})-F_{brk}(x^{\prime})-(A+Bv_{x^{\prime}}+{Cv_{x^{\prime}}}^2)-mgsin(i(x^{\prime}))\Big]
$$

Celle-ci est ensuite simplifiée en considérant que malgré la pente le train se déplace sur un plan et en amalgamant
\\(\vec{e_x}\\) et \\(\vec{e_x}^{\prime}\\). La pente a toujours un impact sur le bilan des forces mais on considère que le train ne se déplace qu'horizontalement, ce qui donne l'équation simplifiée suivante :

$$ a_{x}(t) = \frac{1}{m}\Big[F_{mot}(v_{x}, x)-F_{brk}(x)-(A+Bv_{x}+{Cv_{x}}^2)-mgsin(i(x))\Big] $$

<font color=#aa026d>

### Résolution

</font>

La force motrice et la force de freinage dépendent de l'action du conducteur (il décide d'accélérer ou de freiner plus ou moins fort en fonction de la situation). Cette dépendance se traduit donc par une dépendance de ces deux forces à la position du train. La composante du poids dépend elle aussi de la position du train, car provenant directement des pentes et des virages situées sous ce dernier.

De plus, la force motrice dépend de la vitesse du train (selon la courbe effort vitesse) tout comme la résistance à
l'avancement.

Ces différentes dépendances rendent impossible la résolution analytique de cette équation, et l'accélération du train à chaque instant doit être calculée par intégration numérique.
