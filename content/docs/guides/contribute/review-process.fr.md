## Cycle de review

Une revue de code est un processus itératif.
Pour la fluidité d'une review, il est impératif de [configurer correctement ses notifications github](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications).

Il est conseillé de configurer les dépôts OSRD en *"Participating and @mentions"*. Cela permet d'être notifié d'activités uniquement sur les issues et PR auxquelles vous participez.

```mermaid
sequenceDiagram
  actor A as Auteur PR
  actor R as Reviewer/mainteneur

  A->>R: Demande une review en notifiant spéciquement quelques personnes
  R->>A: Répond à la demande par oui ou non

  loop Boucle entre auteur et reviewer
    R-->>A: Commente, demande des changements
    A-->>R: Répond à chaque commentaire/demande de changement
    A-->>R: Corrige le code si nécessaire dans des « fixups » dédiés
    R-->>A: Vérifie, teste, et commente à nouveau le code
    R-->>A: Résout les conversations/demandes de changement le cas échéant
  end

  A->>R: Rebase si nécessaire
  R->>A: Vérifie l'historique des commits
  R->>A: Approuve ou ferme la PR
  Note left of R: Et fusionne si mainteneur
```

> Les mainteneurs sont automatiquement notifiés par le système de `CODEOWNERS`. L'auteur d'une PR est responsable de faire avancer sa PR dans le processus de review (quitte à notifier manuellement un mainteneur).
