# Fiche de spécification produit — Mindmap Markdown local-first

Pas de Google font, je veux du local.
Et je veux un mode dark, et light.

## 1. Vision produit

Créer un logiciel de mindmap moderne, sobre et puissant, avec une esthétique proche de Notion, Linear et shadcn/ui.

Le produit doit permettre de penser, structurer, éditer et visualiser des idées sous deux formes strictement synchronisées :

* une vue liste / outliner ;
* une vue arbre / mindmap visuelle.

Le principe central du produit est la parité stricte avec Markdown : chaque fichier de mindmap doit rester lisible, éditable et versionnable comme un fichier Markdown standard.

L’application ne doit pas enfermer l’utilisateur dans un format propriétaire opaque. Elle doit produire des fichiers simples, portables, compréhensibles et durables.

## 2. Problème à résoudre

Les logiciels de mindmap classiques sont souvent visuellement datés, fermés, peu compatibles avec les systèmes de notes modernes, ou trop orientés présentation.

Les outils type Notion, Obsidian ou Heptabase sont plus modernes, mais ne donnent pas toujours une vraie expérience de mindmap/outliner fluide, locale, exportable et parfaitement réversible.

Le produit doit combiner :

* la fluidité d’un outliner ;
* la lisibilité d’une mindmap ;
* la portabilité du Markdown ;
* l’élégance d’une interface moderne ;
* la rigueur d’un vrai logiciel local-first.

## 3. Utilisateur cible principal

Utilisateur expert ou semi-expert qui pense en systèmes, projets, concepts et arborescences.

Cas typiques :

* structurer un projet complexe ;
* préparer une présentation ;
* organiser une recherche ;
* clarifier un système d’idées ;
* faire du brainstorming ;
* transformer une pensée floue en structure claire ;
* passer d’une carte mentale à un plan écrit ;
* conserver ses données dans un format durable.

## 4. Principes non négociables

### 4.1 `.mosaic` comme source de vérité

Le fichier `.mosaic` est la source canonique.

L’application peut générer des représentations Markdown ou JSON pour l’édition, le rendu ou l’interopérabilité, mais elles ne doivent pas devenir des formats de fichier utilisateur concurrents.

La structure, le texte, les images et les liens doivent rester contenus dans un seul paquet `.mosaic`.

### 4.2 Parité stricte import/export

Un fichier ouvert, modifié puis sauvegardé ne doit pas perdre d’information.

Objectif technique :

```txt
.mosaic -> AST -> UI -> AST -> .mosaic
```

Le round-trip doit être testé automatiquement.

### 4.3 Local-first

Le produit doit fonctionner sans compte, sans cloud obligatoire, sans serveur obligatoire.

Les fichiers doivent pouvoir être stockés dans n’importe quel dossier : iCloud Drive, Dropbox, Nextcloud, Git, Syncthing, disque local, etc.

### 4.4 Interface sobre et premium

Esthétique souhaitée :

* Notion-like ;
* shadcn/ui-like ;
* claire ;
* dense mais respirante ;
* très bonne typographie ;
* interactions rapides ;
* peu de friction ;
* pas d’effet visuel gratuit.

### 4.5 Deux vues synchronisées

Le même fichier doit pouvoir être affiché en :

* vue liste / outliner ;
* vue arbre / mindmap.

Une modification dans une vue doit être immédiatement reflétée dans l’autre.

## 5. Format de fichier proposé

Extension recommandée :

```txt
.mosaic
```

Le fichier `.mosaic` est un paquet local unique. Il contient un manifeste, le document de carte et les assets nécessaires.

Exemple de document interne :

```md
---
mindmap:
  version: 1
  defaultView: list
  layout: horizontal
  root: node-root
nodes:
  node-root:
    collapsed: false
    color: neutral
    x: 0
    y: 0
  node-product:
    collapsed: true
    color: blue
    x: 320
    y: 120
assets:
  folder: ./assets
---

- # Produit idéal {#node-root}
  - Vision {#node-product}
    - Créer un outil de pensée visuelle local-first
    - Compatible Markdown
    - Exportable et durable
  - Interface
    - Vue liste
    - Vue mindmap
    - Édition riche
  - Assets
    - ![Référence visuelle](./assets/reference.png)
```

## 6. Modèle de données conceptuel

Chaque entrée de mindmap est un node.

```ts
type MindNode = {
  id: string
  parentId: string | null
  children: string[]
  markdown: string
  collapsed: boolean
  color?: NodeColor
  position?: {
    x: number
    y: number
  }
  createdAt?: string
  updatedAt?: string
}
```

Le contenu principal du node est du Markdown.

Les métadonnées UI sont stockées dans le frontmatter :

* position ;
* couleur ;
* état replié/déplié ;
* largeur éventuelle du node ;
* layout préféré ;
* vue par défaut.

## 7. Fonctionnalités cœur

### 7.1 Création et édition de fichiers

L’utilisateur doit pouvoir :

* créer une nouvelle mindmap ;
* ouvrir un fichier `.mosaic` ;
* importer un fichier `.md` ou `.json` comme document `.mosaic` enrichissable ;
* sauvegarder le fichier ;
* dupliquer une mindmap ;
* renommer une mindmap ;
* déplacer un fichier ;
* gérer un dossier d’assets associé.

### 7.2 Vue liste / outliner

Vue prioritaire pour le MVP.

Fonctions attendues :

* créer un node ;
* supprimer un node ;
* renommer un node ;
* indenter / désindenter ;
* déplacer un node vers le haut ou le bas ;
* drag and drop ;
* replier / déplier ;
* focus sur un node ;
* breadcrumbs ;
* recherche dans la carte ;
* raccourcis clavier.

Raccourcis souhaités :

```txt
Enter        -> nouveau node frère
Tab          -> indenter
Shift+Tab    -> désindenter
Backspace    -> supprimer si vide
Cmd/Ctrl+↑   -> déplacer vers le haut
Cmd/Ctrl+↓   -> déplacer vers le bas
Cmd/Ctrl+.   -> replier / déplier
Cmd/Ctrl+K   -> command palette
```

### 7.3 Vue arbre / mindmap

La vue arbre doit permettre une navigation visuelle dans la même structure.

Fonctions attendues :

* rendu graphique des nodes ;
* edges parent-enfant ;
* layout automatique horizontal ;
* option layout vertical ;
* zoom ;
* pan ;
* mini-map éventuelle ;
* drag manuel des nodes ;
* sauvegarde des positions ;
* repli / dépli graphique ;
* édition inline du texte ;
* sélection multiple ;
* recentrage sur le node actif.

Important : la vue mindmap ne doit pas devenir une base de données graphique indépendante. Elle est une projection du Markdown.

### 7.4 Édition de texte riche

Chaque node doit accepter du Markdown enrichi.

Fonctions souhaitées :

* gras ;
* italique ;
* barré ;
* code inline ;
* liens ;
* images ;
* titres légers ;
* listes internes simples ;
* citations ;
* blocs code ;
* couleurs de texte ;
* couleur de fond / couleur du node.

À éviter dans le MVP :

* tableaux complexes ;
* colonnes ;
* bases de données façon Notion ;
* embeds dynamiques complexes ;
* nested blocks trop profonds dans un seul node.

### 7.5 Images et assets

Le produit doit permettre :

* glisser-déposer une image ;
* copier-coller une image ;
* importer une image depuis le disque ;
* afficher une image dans un node ;
* stocker l’image dans un dossier `assets/` lié à la mindmap ;
* réécrire automatiquement le lien Markdown.

Exemple :

```md
![Nom de l’image](./assets/nom-image.png)
```

Règle : ne pas stocker les images en base64 dans le Markdown, sauf option explicite d’export autonome.

### 7.6 Import

Formats d’import prioritaires :

1. Markdown `.md` ;
2. OPML ;
3. FreeMind `.mm` ;
4. texte indenté ;
5. JSON `.json` ;
6. XMind si techniquement raisonnable.

L’import doit produire un document `.mosaic` propre, même si la source ouverte est `.md` ou `.json`.

### 7.7 Export

Formats d’export de lecture / partage prioritaires :

1. Markdown standard ;
2. OPML ;
3. HTML ;
4. PDF ;
5. PNG ;
6. SVG ;
7. JSON `.json` ;
8. texte indenté.

L’export Markdown doit pouvoir ignorer les métadonnées visuelles si l’utilisateur veut un fichier propre.

Modes d’export Markdown :

* complet : contenu + frontmatter ;
* clean : contenu uniquement ;
* outline : structure textuelle simple ;
* document : transformation en plan rédigé.

## 8. UX attendue

### 8.1 Layout général

Interface recommandée :

* sidebar gauche : fichiers / bibliothèque ;
* zone centrale : vue active ;
* toolbar supérieure : titre, vue, export, recherche ;
* panneau droit optionnel : propriétés du node ;
* command palette globale.

### 8.2 Comportement Notion-like

Attendus :

* édition directe ;
* slash command ;
* toolbar flottante sur sélection ;
* menu contextuel propre ;
* drag handle discret ;
* focus mode ;
* raccourcis rapides ;
* autosave ;
* undo/redo fiable.

### 8.3 Propriétés de node

Chaque node peut avoir :

* titre / contenu ;
* couleur ;
* état collapsed ;
* image ;
* lien ;
* tag ;
* note longue éventuelle ;
* statut optionnel ;
* priorité optionnelle.

Les propriétés avancées doivent rester discrètes pour ne pas transformer le produit en usine à gaz.

## 9. Stack technique recommandée

### 9.1 Version web prototype

```txt
Vite
React
TypeScript
Tailwind
shadcn/ui
Zustand
Tiptap ou ProseMirror
React Flow
unified / remark / mdast
gray-matter
```

### 9.2 Version desktop idéale

```txt
Tauri
React
TypeScript
SQLite local optionnel
File System Access
Native filesystem APIs
```

### 9.3 Parsing Markdown

Bibliothèques recommandées :

```txt
unified
remark-parse
remark-stringify
mdast-util-to-markdown
gray-matter
yaml
unist-util-visit
```

### 9.4 Édition riche

Options :

* Tiptap : plus produit, plus rapide à intégrer ;
* ProseMirror direct : plus bas niveau, plus de contrôle ;
* Lexical : intéressant, mais demanderait plus de travail pour la parité Markdown stricte.

Recommandation : commencer avec Tiptap, mais isoler une couche Markdown maison pour ne pas dépendre entièrement de sa conversion Markdown.

## 10. Architecture fonctionnelle

```txt
File System
  ↓
Markdown Parser
  ↓
MDAST / AST Markdown
  ↓
Mindmap Tree Model
  ↓
State Store
  ↓
Views:
  - Outliner View
  - Mindmap View
  - Export View
  ↓
Serializer
  ↓
.mosaic file
```

Le flux doit toujours pouvoir revenir vers Markdown.

## 11. Architecture des dossiers

Structure possible :

```txt
src/
  app/
  components/
    ui/
    outliner/
    mindmap/
    editor/
    sidebar/
  core/
    parser/
    serializer/
    model/
    importers/
    exporters/
    layout/
  stores/
  hooks/
  lib/
  styles/
```

## 12. MVP recommandé

Objectif MVP : prouver la boucle complète.

Scope MVP :

* créer un fichier `.mosaic` ;
* ouvrir un fichier `.mosaic` ;
* parser une liste Markdown imbriquée ;
* afficher en vue liste ;
* créer / supprimer / déplacer / indenter des nodes ;
* replier / déplier ;
* sauvegarder sans perte ;
* afficher une vue mindmap simple ;
* basculer entre liste et mindmap ;
* exporter en Markdown clean.

À exclure du MVP :

* collaboration temps réel ;
* cloud sync ;
* IA ;
* présentation ;
* PDF avancé ;
* tableaux ;
* plugins ;
* mobile.

## 13. V1 recommandée

Après le MVP :

* édition riche ;
* images ;
* drag and drop ;
* export PNG/SVG/PDF ;
* import OPML ;
* recherche ;
* command palette ;
* thèmes ;
* bibliothèque locale ;
* autosave ;
* historique ;
* raccourcis clavier complets.

## 14. V2 possible

Fonctions avancées :

* backlinks entre nodes ;
* liens entre mindmaps ;
* mode présentation ;
* export deck ;
* IA pour restructurer une mindmap ;
* assistant de reformulation ;
* clustering automatique ;
* templates ;
* plugin system ;
* sync optionnelle ;
* collaboration ;
* mobile companion.

## 15. Critères de réussite

Le produit est réussi si :

* un utilisateur peut penser plus vite qu’avec Xmind ou MindNode ;
* le fichier `.mosaic` reste un paquet local, portable et versionnable ;
* l’import/export ne détruit pas la structure ;
* la vue liste est aussi fluide qu’un outliner dédié ;
* la vue mindmap donne une vraie clarté visuelle ;
* l’interface reste élégante et sobre ;
* les données restent possédées par l’utilisateur.

## 16. Risques techniques principaux

### 16.1 Parité Markdown trop ambitieuse

Risque : vouloir supporter tout Markdown dès le début.

Solution : définir un sous-ensemble strict au MVP.

### 16.2 Canvas construit trop tôt

Risque : créer une belle mindmap mais sans modèle solide.

Solution : construire d’abord parser, serializer et outliner.

### 16.3 Édition riche instable

Risque : conflit entre éditeur WYSIWYG et Markdown canonique.

Solution : isoler une couche de transformation testée.

### 16.4 Trop de fonctionnalités Notion-like

Risque : dérive vers un clone de Notion.

Solution : rester centré sur mindmap + outline + Markdown.

## 17. Décision produit centrale

Le produit ne doit pas être pensé comme :

```txt
Un canvas avec export Markdown
```

Mais comme :

```txt
Un fichier Markdown vivant avec plusieurs vues interactives
```

Cette différence doit guider toute l’architecture.

## 18. Priorité absolue pour le développeur

Construire d’abord un prototype technique de round-trip :

```txt
1. Charger un .mosaic
2. Parser la structure
3. L’afficher en outliner
4. Modifier l’arbre
5. Sauvegarder
6. Réouvrir
7. Vérifier qu’aucune information n’est perdue
```

Tant que cette boucle n’est pas fiable, aucune fonctionnalité visuelle avancée ne doit être prioritaire.
