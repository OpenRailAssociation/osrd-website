---
title: "Intégration numérique"
linkTitle: "Intégration numérique"
weight: 30
---

<!-- script to auto-render KaTeX extension -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css" integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js" integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>

#### Introduction

OSRD, en tant que simulateur d'exploitation de train, doit être capable de simuler la physique d'un voyage en train. L'accélération du train étant influencée par de nombreux facteurs différents changeant le long du trajet (pente, courbure, force de traction du moteur...), la simulation doit être séparée en étapes suffisamment petites pour considérer tous ces facteurs comme constants, puis utiliser l'équation du mouvement de Newton pour calculer le déplacement et la vitesse du train. La méthode d'Euler est la plus simple pour calculer ces paramètres, mais elle présente un certain nombre d'inconvénients. Cet article explique la méthode d'Euler, pourquoi elle ne convient pas aux besoins d'OSRD et quelle méthode d'intégration doit être utilisée pour la remplacer.

#### La méthode d'Euler

##### Avec des pas de temps

La méthode d'Euler appliquée à l'intégration de l'équation du mouvement d'un train est :

$$v_{n+1}=\gamma_n(v_n)dt+v_n$$ <div style="text-align: center"> **(1)** </div>

$$x_{n+1}=\frac{1}{2}\gamma_n(v_n)dt^2+v_ndt+x_n$$ <div style="text-align: center"> **(2)** </div>

Avec :

- *v<sub>n+1</sub>* : vitesse calculée au pas **n+1**
- *γ<sub>n</sub>(v<sub>n</sub>)* : accélération calculée au pas **n**
- *v<sub>n</sub>* : vitesse calculée à l'étape **n**

##### Avec des pas de distance

Au lieu d'utiliser un pas de temps *dt*, nous séparons le calcul par des pas de distance *h*. Ainsi, en utilisant l'équation d'intégration temporelle **(2)** ci-dessus, sachant que *x<sub>n+1</sub>-x<sub>n</sub>=h*, nous obtenons :

$$dt=-\frac{v_n}{\gamma_n(v_n)}+\sqrt{(\frac{v_n}{\gamma_n(v_n)})^2+\frac{2h}{\gamma_n(v_n)}}$$ <div style="text-align: center"> **(3)** </div>

Et en utilisant **(1)**, en remplaçant *dt*, on obtient :

$$v_{n+1}=\sqrt{v^2_n+2h\gamma_n(v_n)}$$ <div style="text-align: center"> **(4)** </div>

Et puis simplement :
$$x_{n+1}=x_n+h$$ <div style="text-align: center"> **(5)** </div>

#### Pourquoi la méthode d'Euler utilisant l'intégration temporelle ne convient-elle pas à nos besoins ?

La méthode d'intégration d'Euler dans le temps présente un certain nombre de problèmes :

- Comme on intègre dans le temps, on ne peut retrouver que les conditions du point de départ de l'étape d'intégration (pente, paramètres d'infrastructure, etc.) car on ne sait pas où elle se termine
- Elle ne permet pas d'anticiper les futurs changements de directive : nous ne pouvons réagir qu'en comparant l'état actuel du train à ce qu'il est censé être
- La méthode actuelle génère beaucoup de données, car il y a beaucoup d'étapes d'intégration

#### La méthode d'Euler-Cauchy

##### Avec des pas de temps

La méthode Euler-Cauchy appliquée à l'intégration de l'équation du mouvement d'un train est :

$$v^*_{n+1}=\gamma_n(v_n)dt+v_n$$ <div style="text-align: center"> **(6)** </div>

$$\gamma=\frac{\gamma_n(v_n)+\gamma_{n+1}(v^*_{n+1})}{2}$$ <div style="text-align: center"> **(7)** </div>

$$v_{n+1}=\gamma dt+v_n$$ <div style="text-align: center"> **(8)** </div>

Elle fonctionne de la même manière que la méthode d'Euler, mais en remplaçant l'accélération à l'étape **n** par la valeur moyenne de l'accélération entre l'étape **n** et une étape approximative **n+1**.

##### Avec des pas de distance

Même chose que la méthode d'Euler, sachant que *x<sub>n+1</sub>-x<sub>n</sub>=h*, on obtient :

$$v_{n+1}=\sqrt{v^2_n+2h\gamma}$$ <div style="text-align: center"> **(9)** </div>

Avec :

$$\gamma=\frac{\gamma_n(v_n)+\gamma_{n+1}(v^*_{n+1})}{2}$$

$$v^*_{n+1}=\gamma_n(v_n)dt+v_n$$

#### La méthode RK4

##### Avec des pas de temps

La méthode Runge-Kutta 4 appliquée à l'intégration de l'équation du mouvement d'un train est :

$$v_{n+1}=v_n+\frac{h}{6}(k_1+2k_2+2k_3+k_4)$$ <div style="text-align: center"> **(10)** </div>

Avec :

$$k_1=\gamma_n(v_n)$$ <div style="text-align: center"> **(11)** </div>

$$k_2=\gamma_{n+\frac{1}{2}}(v_n+\frac{h}{2}k_1)$$ <div style="text-align: center"> **(12)** </div>

$$k_3=\gamma_{n+\frac{1}{2}}(v_n+\frac{h}{2}k_2)$$ <div style="text-align: center"> **(13)** </div>

$$k_4=\gamma_{n+1}(v_n+hk_3)$$ <div style="text-align: center"> **(14)** </div>

##### Avec des pas de distance

La même chose, mais cette fois :

$$v_{n+1}=\sqrt{v^2_n+2h\gamma}$$ <div style="text-align: center"> **(9)** </div>

Avec :

$$\gamma=\frac{1}{6}(k_1+2k_2+2k_3+k_4)$$ <div style="text-align: center"> **(15)** </div>

#### Quelle méthode choisir ?

##### Étude de la précision et de la vitesse de calcul

Différentes méthodes d'intégration auraient pu remplacer l'intégration d'Euler de base dans l'algorithme d'OSRD. Afin de décider quelle méthode conviendrait le mieux, une étude sur la précision et la vitesse de calcul de différentes méthodes a été menée. Cette étude a comparé les méthodes suivantes :

- Euler
- Euler-Cauchy
- Runge-Kutta 4
- Adams 2
- Adams 3

Toutes les explications sur ces méthodes peuvent être trouvées dans [ce document](https://github.com/DGEXSolutions/osrd/wiki/documents/integration/MethodesNumeriques_EricGoncalves.pdf), et le code python utilisé pour la simulation est [ici](https://raw.githubusercontent.com/wiki/DGEXSolutions/osrd/code/integration/Tests_precision.py).

La simulation calcule la position et la vitesse d'un 2TGVDAZYEUM accélérant sur une ligne droite plate. L'intégration se fait en fonction du temps et non de la distance, car elle est beaucoup plus rapide à mettre en œuvre.

###### Simulation avec les mêmes pas de temps

Une courbe de référence a été simulée en utilisant la méthode d'Euler avec un pas de temps de 0,1s, puis les autres méthodes ont été simulées avec un pas de temps de 1s. Il est alors possible de comparer simplement chaque courbe à la courbe de référence, en calculant la valeur absolue de la différence à chaque point calculé. Voici l'erreur absolue résultante de la position du train sur sa distance parcourue :

![precisions_h_equivalent](../precisions_h_equivalent.png)

Il apparaît immédiatement que la méthode d'Euler est d'environ d'un ordre de grandeur moins précise que les quatre autres. Chaque courbe présente un pic où la précision est extrêmement élevée (erreur extrêmement faible), ce qui s'explique par le fait que toutes les courbes commencent légèrement au-dessus de la courbe de référence, la croisent en un point et finissent légèrement en dessous, ou vice-versa.

Mais comme la précision n'est pas le seul indicateur important, le temps de calcul de chaque méthode a été mesuré, et voici ce que nous obtenons pour les mêmes paramètres d'entrée (les valeurs sont en secondes) :

![time_h_equivalent](../time_h_equivalent.png)

Ainsi, Euler-Cauchy et Adams 2 sont environ deux fois plus lents que Euler, Adams 3 est environ trois fois plus lent, et RK4 est environ quatre fois plus lent. Ces résultats ont été vérifiés sur des simulations beaucoup plus longues, et les ratios 2 et 3 sont maintenus.

##### Simulation avec temps de calcul équivalent

Comme les temps de calcul de toutes les méthodes dépendent linéairement du pas de temps, il est assez facile de comparer la précision pour un temps de calcul à peu près identique. En multipliant le pas de temps d'Euler-Cauchy et d'Adams 2 par 2, le pas de temps d'Adams 3 par 3, et le pas de temps de RK4 par 4, voici les courbes d'erreur absolue résultantes :

![precisions_time_equivalent](../precisions_time_equivalent.png)

Et voici les temps de calcul, en secondes :

![time_time_equivalent](../time_time_equivalent.png)

Après un certain temps, RK4 tend à être la méthode la plus précise, légèrement plus précise que Euler-Cauchy, et toujours bien plus précise que la méthode d'Euler.

#### Pourquoi garder Runge-Kutta 4

##### Conclusions de l'étude précédente

L'étude de la précision et de la vitesse de calcul présentée ci-dessus montre que RK4 et Euler-Cauchy seraient de bons candidats pour remplacer l'algorithme d'Euler dans OSRD : les deux sont rapides, précis, et assez faciles à mettre en œuvre car ils ne font que des calculs dans une étape courante. **Il a été décidé qu'OSRD utiliserait la méthode Runge-Kutta 4 parce qu'elle est légèrement plus précise que Euler-Cauchy et que c'est une méthode bien connue pour ce type de calcul, donc très adaptée à un simulateur open-source.**

#### Comparaison des méthodes d'Euler et de Runge-Kutta 4

Méthode d'Euler             |  Méthode de Runge-Kutta 4
:-------------------------:|:-------------------------:
![Méthode d'Euler](../euler.png)  |  ![Méthode de Runge-Kutta 4](../rk4.png?style=rk4)
> Comparaison entre la méthode d’Euler et la méthode RK4; l’axe **x** est le temps, l’axe **y** est la vitesse résultante de l’intégration, k1, k2, k3, k4 sont les accélérations correspondent aux points indiqués (dérivatives de la courbe **v(t))**.

La méthode Runge-Kutta 4, par opposition à une simple méthode d'Euler, est une bonne solution à nos besoins :

- Elle permet d'anticiper les futurs changements de directive, puisque nous calculons à chaque fois une estimation du prochain pas pour calculer l'accélération correspondante
- Elle est plus précise pour le même temps de calcul, permettant des étapes d'intégration plus grandes, donc moins de points de données et un temps de calcul plus rapide.

<style>
img[src$="rk4"] {
  margin-top: 15.5%;
}
</style>
