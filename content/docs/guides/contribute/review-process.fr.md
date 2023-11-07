Voici une proposition de flux de travail.

**Il est nécessaire de communiquer par messagerie instantanée (Matrix, Slack, etc.) afin de garantir le fonctionnement du flux de la validation d'une PR.**

```mermaid
sequenceDiagram
  actor A as Auteur PR
  actor R as Reviewer/mainteneur
  
  A->>R: Demande une review en notifiant spéciquement quelques personnes
  R->>A: Répond à la demande par oui ou non
  
  loop Boucle entre auteur et reviewer
    R-->>A: Commente, demande des changements
    A-->>R: Répond à chaque commentaire/requested changes
    A-->>R: Corrige le code si nécessaire dans des « fixups » dédiés
    R-->>A: Vérifie et commente à nouveau le code
    R-->>A: Résoud les conversations/requested changes le cas échéant
  end
 
  A->>R: Rebase si nécessaire
  R->>A: Vérifie l'historique des commits
  R->>A: Approuve ou ferme la PR
  Note left of R: Et fusionne si mainteneur
```