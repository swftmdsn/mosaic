# Mosaic

Mosaic est un espace de pensée visuelle pour transformer des idées floues en structures claires.

Il combine la vitesse d'un plan, la lisibilité d'une carte mentale et l'élégance d'un outil de travail moderne. Vous écrivez, organisez, déplacez, repliez, reliez et visualisez vos idées sans changer de contexte.

## Penser plus clairement

Mosaic est conçu pour les moments où une simple note devient trop plate, et où une carte mentale classique devient trop rigide.

Utilisez-le pour :

- structurer un projet complexe ;
- préparer une présentation, un atelier ou une stratégie ;
- organiser une recherche, une veille ou un système de connaissances ;
- clarifier une décision avec ses branches, hypothèses et conséquences ;
- faire émerger un plan à partir d'un brainstorming ;
- passer d'une vision globale à une liste d'actions concrètes ;
- garder une trace durable de vos raisonnements.

## Deux façons de voir la même idée

Mosaic permet de passer naturellement d'une vue plan à une vue mindmap.

La vue plan est faite pour écrire vite, réorganiser une hiérarchie, faire monter ou descendre une idée, isoler une branche et avancer sans friction.

La vue mindmap donne de la distance : elle rend les relations visibles, montre les zones trop chargées, révèle les branches faibles et aide à retrouver le fil d'un système d'idées.

Les deux vues racontent la même chose, avec deux rythmes différents : précision quand vous écrivez, recul quand vous explorez.

## Un outil pour travailler, pas pour décorer

Mosaic vise une expérience dense, calme et premium.

L'interface laisse la priorité au contenu : menus flottants, actions rapides, raccourcis visibles quand ils sont utiles, panneaux discrets, mode clair et mode sombre. Chaque détail cherche à réduire la friction plutôt qu'à ajouter du spectacle.

Le design s'inspire des meilleurs outils de productivité modernes : lisible comme Notion, net comme Linear, minimal sans être vide, précis sans devenir froid.

## Ce que Mosaic aide à produire

Mosaic n'est pas seulement un outil pour dessiner des cartes. C'est un outil pour faire progresser une pensée.

Il aide à produire :

- des plans de projet plus nets ;
- des architectures d'idées plus faciles à expliquer ;
- des supports de présentation mieux organisés ;
- des cartes de recherche navigables ;
- des roadmaps et décisions plus lisibles ;
- des notes qui restent réutilisables après la phase de réflexion.

## Pour les esprits qui pensent en systèmes

Mosaic s'adresse aux personnes qui manipulent beaucoup d'information et ont besoin de voir les relations entre les choses.

Produit, stratégie, recherche, design, écriture, enseignement, conseil, entrepreneuriat : le point commun n'est pas le métier, c'est la façon de penser. Mosaic est fait pour celles et ceux qui construisent des arborescences, testent des angles, déplacent des blocs, comparent des options et cherchent la forme juste d'une idée.

## Une sensation locale, personnelle et durable

Mosaic respecte le rythme de travail individuel : pas de compte à créer pour commencer, pas de bruit collaboratif imposé, pas de tableau de bord inutile avant d'écrire.

Vos cartes restent des objets que vous pouvez ranger, retrouver, versionner, partager ou archiver. L'outil accompagne votre système de travail au lieu de l'enfermer.

## La promesse

Mosaic veut devenir le bureau calme où une idée peut prendre forme.

Un endroit où l'on commence par quelques lignes, où l'on déploie une structure, où l'on visualise les connexions, puis où l'on repart avec un plan clair.

Penser. Structurer. Voir. Reprendre la main.

## Développement

Mosaic est une application Vite/TypeScript empaquetée en desktop macOS avec Tauri 2.

Prérequis locaux :

- Node.js compatible avec `^20.19.0 || >=22.12.0` ;
- npm ;
- Rust et Cargo ;
- les Command Line Tools Xcode sur macOS.

Installer les dépendances :

```sh
npm ci
```

Lancer la version web en développement :

```sh
npm run dev
```

Lancer Mosaic en desktop macOS avec Tauri :

```sh
npm run tauri:dev
```

Construire le frontend seul :

```sh
npm run build
```

Construire les bundles macOS Tauri (`.app` et `.dmg`) :

```sh
npm run tauri:build
```

Les bundles générés se trouvent dans :

- `src-tauri/target/release/bundle/macos/Mosaic.app`
- `src-tauri/target/release/bundle/dmg/Mosaic_0.1.0_aarch64.dmg`

Pour une build macOS universelle Apple Silicon + Intel, utilisez :

```sh
npm run tauri:build:universal
```

## Licence

Ce projet est proprietaire et publie uniquement pour consultation. Voir [LICENSE](LICENSE).
