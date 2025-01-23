---
title: "Écrire du code"
linkTitle: "Écrire du code"
weight: 3
description: "Apporter des modifications au code d'OSRD"
---

1. Si vous n'être pas un habitué de Git, [suivez ce tutoriel](https://learngitbranching.js.org/)

2. **Créez une branche**  
   Si vous comptez contribuer régulièrement, vous pouvez demander accès au [dépôt principal](https://github.com/OpenRailAssociation/osrd). Sinon, [créez un fork](https://github.com/OpenRailAssociation/osrd/fork).

3. **Ajoutez des changements sur votre branche**  
   Essayez de découper votre travail en étapes macroscopiques, et sauvegardez vos changements dans un commit à la fin de chaque étape. Essayez de suivre [les conventions du projet](../conventions/).

4. **Conservez votre branche à jour**

   ```
   git switch <your_branch>
   git fetch
   git rebase origin/dev
   ```

*[Continuer vers le style des commits ‣]({{< ref "commit-conventions">}})*
