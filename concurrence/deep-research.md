# Prompt recherche

Dans un nouveau dossier racine /concurrence, je voudrais que tu fasses une deep research en ligne, pour évaluer dans une première partie quel coverage on a en Jobs to be done et en fonctionalité de : xmind, whimsical, et markmind.

Dans une deuxième partie je voudrais savoir si ce projet pourrait avoir du sens gratuitement (un peu comme le modèle de quicknote.io) sur internet, ou en freemium comme cal.com et opensource, ou même s'il serait un refelxe interessant pour les personnes qui ont besoin d'un endroit d'outlined, et de mindmapping rapide facile d'accès, puis potentiellement d'un outil plus récurrent.

# Deep research concurrence - Mosaic

Date de recherche : 2026-05-23  
Produit analyse : Mosaic, espace local-first de mindmapping et outlining synchronises, avec Markdown comme source de verite.

## Synthese courte

Mosaic a un angle distinct si le produit reste radicalement centre sur trois promesses : commencer sans compte, penser en outline aussi vite que dans une note, puis visualiser la meme structure en mindmap sans enfermer l'utilisateur dans un format proprietaire.

Xmind couvre deja tres fort le mindmapping professionnel : structures multiples, export riche, presentation, AI, collaboration, Gantt, taches. Whimsical couvre tres fort la collaboration visuelle rapide : boards, flowcharts, wireframes, docs, mind maps, templates, commentaires, partage. MarkMind est le plus proche du pari Markdown + mindmap + outline, mais il vit dans Obsidian, sa proposition est plus plugin/power-user, et une partie de sa valeur est liee a l'annotation PDF.

Le meilleur espace pour Mosaic n'est donc pas "un Xmind moins complet" ni "un Whimsical solo". C'est plutot : un reflexe web/local pour transformer une liste, une idee ou un plan en carte claire, avec export durable, Markdown propre, zero onboarding, puis des capacites recurrentes pour utilisateurs qui veulent garder leurs cartes dans leur systeme de fichiers.

Recommandation : lancer en gratuit sans compte pour le coeur rapide, puis monetiser le recurrent via Pro local/sync/export avance, ou open-core leger si l'objectif est de gagner la confiance des utilisateurs Markdown/dev/Obsidian. Le modele purement gratuit peut creer le reflexe, mais il faut une voie de capture de valeur avant les couts de stockage/partage/AI.

## Sources principales

- Xmind features : https://xmind.com/features
- Xmind pricing : https://xmind.com/pricing
- Xmind outliner : https://xmind.com/user-guide/outliner-new
- Xmind Markdown to Mind Map : https://xmind.com/user-guide/markdown-to-mind-map
- Xmind import/export : https://xmind.com/user-guide/working-with-files
- Whimsical mind maps : https://whimsical.com/learn/get-started/mind-maps
- Whimsical export : https://whimsical.com/learn/imports-exports/exporting-from-whimsical
- Whimsical pricing : https://whimsical.com/pricing
- MarkMind site : https://www.markmind.net/
- MarkMind GitHub : https://github.com/MarkMindCkm/obsidian-markmind
- MarkMind open-source predecessor : https://github.com/MarkMindCkm/obsidian-enhancing-mindmap
- QuickNote.io Product Hunt : https://www.producthunt.com/products/quicknote-io?launch=quicknote-io
- QuickNotes.io : https://www.quicknotes.io/
- Cal.com pricing : https://cal.com/pricing
- Cal.diy announcement : https://cal.com/es/blog/cal-diy-open-source-to-closed-source
- Cal.diy GitHub : https://github.com/calcom/cal.diy

## Assumptions

Le rapport evalue la couverture cible de Mosaic a partir de `README.md`, `specification.md`, `roadmap.md` et d'un survol du code. Ce n'est pas un audit exhaustif de l'etat implemente en production.

Je distingue :

- `Mosaic cible` : ce que le produit veut devenir selon la specification.
- `Mosaic reflexe` : le produit d'acquisition gratuit, accessible sans friction.
- `Mosaic recurrent` : le produit que l'utilisateur garde pour organiser des projets, recherches, plans, decisions et systemes d'idees.

## 1. Lecture concurrentielle

### Xmind

Positionnement : mindmapping complet, grand public/professionnel, cross-platform, avec AI et collaboration.

Faits observes :

- Fonctionne sur web, desktop et mobile.
- Propose des structures multiples : mind map, logic chart, org chart, fishbone, timeline, tree chart, matrix, tree table, etc.
- Integre labels, notes, taches, marqueurs, web links, topic links, attachments, images locales, stickers, audio notes, equations.
- A un mode outliner pour passer d'une carte a une vue liste.
- Supporte import Markdown/OPML/TextBundle et export PNG, SVG, PDF, Excel, Word, OPML, TextBundle, PowerPoint, Markdown.
- Les offres payantes poussent l'export sans watermark, les cartes collaboratives, l'historique, les slides, les taches, Gantt et AI.
- Le plan gratuit limite la creation a 10 maps, avec themes/stickers basiques, 3 jours d'historique, publication par lien et quelques credits AI.

Lecture produit :

Xmind est probablement le concurrent le plus dangereux sur les fonctionnalites visibles. Il coche enormement de cases : mindmap, outline, import Markdown, export Markdown, AI, presentation, projet, taches, collaboration. Sa faiblesse pour Mosaic n'est pas le manque de features ; c'est plutot l'experience proprietaire, la densite produit, la friction d'outil dedie et le fait que Markdown semble etre un format d'import/export, pas la source canonique permanente.

Angle attaquable :

- "Votre fichier reste un Markdown lisible et versionnable."
- "Commencez comme dans une note, visualisez comme dans une carte."
- "Pas besoin d'adopter un logiciel de mindmap lourd pour une pensee de 10 minutes."

### Whimsical

Positionnement : workspace visuel collaboratif pour boards, flowcharts, wireframes, sticky notes, mind maps, docs et AI.

Faits observes :

- Les mind maps se creent dans un Board, avec raccourci `M`.
- `Enter` cree un noeud frere, `Tab` cree un enfant, drag and drop reorganise.
- Personnalisation : lignes courbes/droites, orientation, lien, icones, couleur de ligne, gras/italique, AI-assisted mind mapping.
- Import/export rapide par copier-coller de listes.
- Export board : PNG, PDF, SVG copie, Mermaid pour certains diagrammes. Les docs Whimsical s'exportent en Markdown.
- Le plan gratuit donne des boards prives illimites, membres workspace illimites, 10 guests et 100 actions AI, mais seulement 3 boards d'equipe, exports limites et watermark.
- Le plan Pro est autour de 10 USD/editor/mois en annuel, avec boards d'equipe illimites, private teams, plus de guests, plus d'AI, plus d'historique, timer/voting et suppression des watermarks.

Lecture produit :

Whimsical n'est pas d'abord un outil de mindmap. C'est un outil de visual collaboration. Sa force est la vitesse sociale : partager, commenter, co-construire, passer du flowchart au wireframe, du doc au board. Sa faiblesse pour Mosaic : ce n'est pas local-first, le format de travail n'est pas un fichier Markdown portable, et le mindmap est une forme dans un canvas, pas une discipline d'ecriture structuree.

Angle attaquable :

- "Moins board d'equipe, plus espace personnel de pensee."
- "Pas besoin d'un canvas collaboratif complet pour structurer une idee."
- "Export/import par copier-coller ne suffit pas si le fichier doit devenir votre source de verite."

### MarkMind

Positionnement : plugin Obsidian de mind map, outline et PDF annotation, oriente utilisateurs Markdown/Obsidian.

Faits observes :

- MarkMind se presente comme outil de mind map, outline et annotation PDF base sur l'API Obsidian.
- Il supporte desktop et mobile via Obsidian.
- Il a deux modes de mind map : `Basic` et `Rich`.
- Le mode Basic fonctionne avec outline/table.
- Les raccourcis couvrent : nouveau noeud, indent/unindent, zoom, move node, delete, edit, undo/redo, expand/collapse, drag and drop, changement de layout.
- Le mode Rich ajoute summary, boundary, related link et free node.
- Le format Rich inclut du JSON dans le Markdown.
- Exports : HTML/image, copie en Markdown depuis le Rich mode, PDF via commande dediee.
- Annotation PDF : highlight, rect annotate, relation annotation-noeud, via PDF++.
- Le repo `obsidian-markmind` indique que ce n'est pas open source, meme si un ancien plugin `obsidian-enhancing-mindmap` est MIT.
- Le modele liste un free tier et une option Catalyst a 16 USD a vie, avec PDF annotate et export PDF.

Lecture produit :

MarkMind est le concurrent le plus proche philosophiquement, mais aussi le moins accessible pour le grand public. Il parle aux utilisateurs Obsidian qui acceptent les plugins, les frontmatters, les modes, les commandes et les compromis. Il valide qu'il existe une demande pour "Markdown + mindmap editable + outline". Mais il laisse une place pour un produit plus propre, autonome, beau, rapide et comprehensible hors Obsidian.

Angle attaquable :

- "MarkMind pour Obsidian power users ; Mosaic pour tous ceux qui veulent le meme genre de pensee structuree sans config."
- "Markdown canonique, mais sans demander a l'utilisateur de comprendre les details Obsidian."
- "Experience premium et locale des le premier lancement."

## 2. Coverage Jobs To Be Done

Legende : `Fort` = concurrent couvre tres bien ; `Moyen` = couvre partiellement ; `Faible` = existe mais pas coeur ; `Non` = pas vraiment couvert ; `Cible` = promesse Mosaic a viser.

| Job to be done | Xmind | Whimsical | MarkMind | Mosaic cible | Commentaire |
|---|---:|---:|---:|---:|---|
| Capturer une idee rapidement sans setup | Moyen | Moyen | Faible | Fort | Xmind/Whimsical demandent adoption d'un workspace/outil. MarkMind demande Obsidian. Mosaic doit etre instantane, type note. |
| Transformer une liste/Markdown en mindmap | Fort | Moyen | Fort | Fort | Xmind importe Markdown. Whimsical fait paste-as/list. MarkMind vit dans Markdown. Mosaic doit faire mieux sur round-trip. |
| Outliner rapide au clavier | Fort | Moyen | Fort | Fort | Xmind et MarkMind ont outliner/raccourcis. Whimsical est plus canvas. Mosaic doit etre excellent ici. |
| Visualiser la structure en mindmap | Fort | Fort | Fort | Fort | La parite est attendue. La difference se joue sur fluidite et lisibilite. |
| Reorganiser, replier, deplacer, focus branch | Fort | Moyen | Fort | Fort | Minimum attendu sur ce marche. |
| Enrichir les noeuds avec liens/images/notes | Fort | Moyen | Fort | Moyen/Fort | Xmind est tres riche. MarkMind aussi via Obsidian/PDF. Mosaic doit choisir un coeur utile, pas tout copier. |
| Collaborer en temps reel | Moyen/Fort | Fort | Faible | Faible/Moyen | Ce n'est pas le wedge naturel de Mosaic. A ne pas prioriser trop tot. |
| Presenter ou exporter pour partager | Fort | Moyen/Fort | Moyen | Moyen/Fort | Xmind domine via Pitch/Office/PDF. Mosaic doit au moins exporter proprement Markdown, image, PDF/PNG, .mind zip. |
| Garder un fichier durable, portable, versionnable | Moyen | Faible | Moyen/Fort | Fort | C'est le coeur defensible de Mosaic. Xmind/Whimsical exportent, mais ne sont pas Markdown-source. MarkMind est proche mais plugin. |
| Travailler local-first sans cloud obligatoire | Moyen | Faible | Fort | Fort | Xmind desktop existe, Whimsical est SaaS, MarkMind herite du vault Obsidian. |
| Utiliser l'AI pour generer/refiner une carte | Fort | Moyen/Fort | Faible | Optionnel | Pas necessaire au wedge initial. Peut devenir une fonctionnalite Pro. |
| Gerer un projet/taches/Gantt | Fort | Faible/Moyen | Faible | Faible/Moyen | Xmind pousse deja Gantt/tasks. Mosaic ne doit pas s'y disperser sauf extraction d'actions simple. |
| Construire une base de connaissance recurrente | Moyen | Moyen | Fort | Moyen/Fort | MarkMind gagne via Obsidian. Mosaic peut gagner via fichiers locaux + recherche + dossiers. |

Conclusion JTBD :

Mosaic peut couvrir les JTBD les plus importants pour la pensee individuelle : capture, outline, mindmap, portabilite, local-first. Il ne couvrira pas vite Whimsical sur collaboration ni Xmind sur profondeur professionnelle. Ce n'est pas un probleme si le positionnement est volontaire : "outil reflexe de pensee structuree" avant "suite collaborative de mindmapping".

## 3. Coverage fonctionnel

| Fonctionnalite | Xmind | Whimsical | MarkMind | Mosaic cible | Priorite Mosaic |
|---|---:|---:|---:|---:|---|
| Mindmap editable | Fort | Fort | Fort | Fort | P0 |
| Outliner synchronise | Fort | Moyen | Fort | Fort | P0 |
| Markdown import | Fort | Moyen via paste | Fort | Fort | P0 |
| Markdown comme source canonique | Moyen | Non | Moyen/Fort | Fort | P0 differenciant |
| Round-trip Markdown teste | Faible/Moyen | Non | Moyen | Fort | P0 differenciant |
| Local-first/no account | Moyen | Faible | Fort | Fort | P0 |
| Fichiers versionnables | Moyen | Faible | Fort via Obsidian | Fort | P0 |
| Drag and drop outline | Fort | Fort | Fort | Fort | P0/P1 |
| Focus branch/breadcrumbs | Fort/Moyen | Faible | Moyen | Fort | P1 |
| Search dans carte | Fort/Moyen | Moyen | Obsidian | Fort | P1 |
| Pan/zoom/minimap | Fort | Fort | Fort | Fort | P1 |
| Positions manuelles sauvegardees | Fort | Fort | Fort | Moyen/Fort | P1 |
| Liens entre noeuds | Fort | Moyen | Fort | Fort | P1 |
| Labels sur liens | Moyen | Moyen | Moyen/Fort | Moyen | P2 |
| Images/assets locaux | Fort | Moyen | Fort | Fort | P1 |
| Export PNG/SVG/PDF | Fort | Moyen/Fort | Moyen | Fort | P1 |
| Export Markdown propre | Fort | Docs seulement / paste | Moyen | Fort | P0/P1 |
| Export zip avec assets | Moyen | Faible | Faible | Fort | P1 differenciant |
| Templates | Fort | Fort | Faible | Moyen | P2 |
| Themes/style branches | Fort | Moyen | Moyen | Moyen | P2 |
| Collaboration temps reel | Moyen/Fort | Fort | Faible | Faible | P3 |
| AI map generation/refine | Fort | Moyen/Fort | Faible | Moyen | P3/Pro |
| Presentation mode | Fort | Faible/Moyen | Faible | Faible/Moyen | P3 |
| Gantt/tasks | Fort | Faible/Moyen | Faible | Faible | P3 |
| PDF annotation | Faible | Faible | Fort | Non | Hors scope sauf niche recherche |
| Desktop/mobile natif | Fort | Moyen | Via Obsidian | Plus tard | P3 |

Priorites recommandees :

P0 :

- Outliner au clavier impeccable.
- Vue mindmap parfaitement synchronisee.
- Import/export Markdown fiable.
- Fichier local `.mind.md` lisible.
- Sauvegarde sans compte.
- Demarrage en moins de quelques secondes.

P1 :

- Images/assets et export zip.
- PNG/SVG/PDF.
- Liens entre noeuds.
- Focus branch, breadcrumbs, search.
- Pan/zoom/multiselect stable.

P2 :

- Templates, styles, couleurs, themes.
- Web share read-only.
- Command palette plus complete.

P3 :

- Collaboration.
- AI.
- Presentation mode.
- Sync multi-device.
- Apps desktop/mobile.

## 4. Gaps et opportunites par concurrent

### Face a Xmind

Ce que Xmind couvre mieux :

- Largeur fonctionnelle.
- AI et generation de cartes.
- Export multi-format tres mature.
- Structures multiples.
- Presentation/Pitch.
- Taches/Gantt/projet.
- Cross-platform.

Ce que Mosaic peut couvrir mieux :

- Markdown comme verite permanente, pas seulement import/export.
- Local-first sans compte comme comportement naturel.
- Moins de friction pour une carte rapide.
- UX premium focalisee sur l'ecriture et la structure.
- Export `.mind.md` ou zip comprehensible, rangeable, versionnable.

Implication :

Ne pas combattre Xmind feature par feature. Xmind est deja "le Photoshop de la mindmap". Mosaic doit etre "le Linear/Notion-local de l'outline visuel".

### Face a Whimsical

Ce que Whimsical couvre mieux :

- Collaboration.
- Partage d'equipe.
- Boards polyvalents.
- Flowcharts, wireframes, docs, sticky notes.
- Templates et ateliers.

Ce que Mosaic peut couvrir mieux :

- Solitude productive, pas session d'atelier.
- Fichier durable et portable.
- Ecriture structuree plus dense.
- Pas de workspace a organiser avant de penser.
- Experience plus proche note/outliner.

Implication :

Mosaic ne doit pas se vendre comme board collaboratif. La promesse doit etre personnelle, rapide, calme, exportable.

### Face a MarkMind

Ce que MarkMind couvre mieux :

- Integration Obsidian.
- Ecosysteme de notes et backlinks.
- Annotation PDF.
- Rich mode avec boundary/summary/free nodes.
- Usage power-user deja etabli.

Ce que Mosaic peut couvrir mieux :

- Produit autonome, pas plugin.
- Onboarding beaucoup plus simple.
- Design plus premium.
- Markdown propre et previsible.
- Partage web sans demander Obsidian.
- Moins de complexite de modes Basic/Rich/Table/PDF.

Implication :

MarkMind prouve que le segment "Markdown + mindmap + outline" existe. Mosaic doit gagner par clarte, fiabilite du format et experience zero-config.

## 5. Le modele gratuit type QuickNote.io

QuickNote.io est un bon analogue pour le reflexe : gratuit, anonyme, partageable, sans compte, utile pour une action ponctuelle. Le createur expliquait sur Product Hunt que le probleme etait de partager rapidement liens, images et snippets sans creer un Google Doc ni configurer les droits. QuickNotes.io reprend un angle proche avec Markdown local-first, offline, no sign-up et sync optionnelle.

Application a Mosaic :

Un "QuickMind" gratuit aurait du sens si l'utilisateur peut :

- ouvrir une URL ;
- taper une liste ;
- voir instantanement la carte ;
- copier/exporter/share ;
- fermer sans se creer de compte ;
- revenir plus tard si stockage local.

Ce modele est puissant pour l'acquisition car il cree un geste reflexe. L'utilisateur n'a pas encore "choisi un outil de mindmapping", il a juste besoin d'un endroit pour clarifier une idee.

Risques du modele purement gratuit :

- Le partage public cree des risques de moderation, contenu indexe, abus, fichiers illegaux, spam.
- Le stockage cloud gratuit cree une dette de couts.
- Sans compte, la retention est faible sauf si le local-first est excellent.
- Si le produit reste uniquement ponctuel, il sera substituable par n'importe quel bloc-notes + AI + export.

Recommendation :

Le gratuit doit etre le wedge, pas tout le business. Le coeur gratuit doit rester tres genereux localement, mais les fonctionnalites de persistance cloud, partage prive, export avance, sync et AI peuvent devenir payantes.

## 6. Le modele freemium/open source type Cal.com

Cal.com donne un modele interessant mais a manier avec prudence. En 2026, Cal.com a separe son produit commercial et `Cal.diy`, une edition communautaire open source/self-hostable sous MIT. Cal.diy garde le coeur scheduling mais retire les fonctionnalites commerciales/enterprise comme Teams, Organizations, Workflows, SSO/SAML et Insights.

Le pattern transferable :

- Donner un coeur utile et credible.
- Garder une edition self-host/local qui construit la confiance.
- Monetiser le cloud, les equipes, les integrations, l'admin, le support, la compliance et les fonctions couteuses.

Mais Mosaic n'a pas le meme marche que Cal.com :

- Scheduling est naturellement viral et externe : on partage un lien de rendez-vous a d'autres personnes.
- Mindmapping/outlining est souvent personnel et interne.
- L'open source peut aider Mosaic sur la confiance format/local-first, mais ne garantit pas la distribution.
- Le self-hosting d'un outil de pensee est moins evident que self-hosting d'une infrastructure de scheduling.

Modele recommande pour Mosaic :

Option A - Gratuit local + Pro SaaS :

- Gratuit : fichiers locaux illimites, `.mind.md`, outline/mindmap, export Markdown/PNG, pas de compte.
- Pro individuel : sync chiffree, historique, recherche cross-files, export PDF/SVG/zip, themes, command palette avancee, AI credits.
- Team plus tard : dossiers partages, commentaires, templates d'equipe, permissions.

Option B - Open-core :

- Open source : parser/serializer `.mind.md`, app locale de base, viewer, import/export.
- Payant : sync, partage prive, collaboration, AI, PDF/SVG/zip avance, app desktop pack agee, integrations.

Option C - Entierement gratuit :

- Pertinent seulement si objectif portfolio/audience/demonstration.
- Faible comme modele durable si partage/cloud/AI sont inclus.
- Peut marcher avec sponsor, donations ou conversion vers un produit adjacent, mais moins defendable.

Ma recommandation : Option A d'abord, avec une ouverture selective de la spec de format et peut-etre du parser. Open source complet plus tard seulement si la strategie de distribution vise clairement devs/Obsidian/local-first.

## 7. Est-ce que Mosaic peut devenir un reflexe ?

Oui, mais seulement si le produit gagne la premiere minute.

Le reflexe cible :

- "J'ai une idee confuse."
- "Je colle mes bullets dans Mosaic."
- "Je vois la structure."
- "Je deplace/replie deux branches."
- "J'exporte ou je garde le fichier."

Ce reflexe est different de Xmind :

- Xmind = je cree une mindmap.
- Mosaic = je clarifie une pensee.

Different de Whimsical :

- Whimsical = je travaille visuellement avec d'autres.
- Mosaic = je structure avant de partager.

Different de MarkMind :

- MarkMind = j'etends mon vault Obsidian.
- Mosaic = j'ai un outil autonome et rapide qui respecte Markdown.

Conditions de reussite :

1. Zero compte pour commencer.
2. Une zone de saisie outline qui donne envie d'ecrire, pas de dessiner.
3. Vue mindmap immediatement utile, lisible sans reglages.
4. Export/import qui inspire confiance.
5. Sauvegarde locale claire : l'utilisateur sait ou vit son travail.
6. UX sobre, moderne, dense, sans feeling "outil de diagramme".
7. Un format public documente, meme si le produit n'est pas totalement open source.

## 8. Positionnement conseille

Phrase courte :

Mosaic est l'outliner visuel local-first pour transformer une idee brute en carte claire, sans compte et sans format opaque.

Promesse :

- Penser vite comme dans une note.
- Reorganiser proprement comme dans un outliner.
- Voir les relations comme dans une mindmap.
- Garder un fichier Markdown durable.

Audience prioritaire :

- Fondateurs, product managers, consultants, designers, chercheurs, auteurs, enseignants, etudiants avances.
- Utilisateurs Notion/Obsidian/Linear qui aiment les outils propres mais veulent une mindmap plus fluide.
- Personnes qui font souvent : briefs, plans, strategies, architecture d'idees, preparatifs d'ateliers, recherches, decisions.

Audience a eviter au lancement :

- Grandes equipes qui veulent Miro/Whimsical.
- Utilisateurs qui demandent Gantt/projet lourd.
- Utilisateurs qui veulent d'abord des cartes tres decoratives.

## 9. Packaging produit propose

### Gratuit sans compte

- Creation locale illimitee.
- Outline + mindmap.
- Import Markdown / paste bullets.
- Export Markdown, JSON ou `.mind.md`.
- Export PNG basique.
- Sauvegarde navigateur et/ou fichier local.
- Pas de watermark sur fichiers locaux.

Objectif : reflexe et confiance.

### Pro individuel

- Sync chiffree.
- Historique versions.
- Recherche dans toutes les cartes.
- Export PDF/SVG/zip assets.
- Themes et styles avances.
- Templates personnels.
- AI : text-to-map, map refine, summarize branch, extract actions.
- Desktop app optionnelle.

Objectif : usage recurrent.

### Team plus tard

- Espaces partages.
- Commentaires.
- Review mode.
- Templates d'equipe.
- Permissions.
- Exports de presentation.

Objectif : expansion, pas wedge initial.

### Open source / open format

Minimum recommande :

- Spec publique `.mind.md`.
- Tests round-trip publics ou documentes.
- Examples de fichiers.
- Export lisible sans app.

Open source complet possible :

- Parser/serializer.
- Viewer read-only.
- CLI convert `.mind.md` vers Markdown/JSON/SVG.

Objectif : confiance et adoption technique.

## 10. Roadmap competitive

### Phase 1 - Reflexe

But : battre le bloc-notes + capture rapide.

- Nouvelle carte instantanee.
- Paste bullets/Markdown -> map.
- Outliner clavier.
- Mindmap lisible.
- Export Markdown/PNG.
- Local save.
- URL partageable optionnelle.

Mesure :

- Temps entre ouverture et premiere carte utile.
- Taux d'export/share.
- Taux de retour local sans compte.

### Phase 2 - Confiance

But : battre les exports fragiles et les formats opaques.

- `.mind.md` stable.
- Import/export round-trip documente.
- Assets en dossier/zip.
- Search, focus branch, breadcrumbs.
- Version history local.

Mesure :

- Nombre de fichiers recrees/ouverts.
- Nombre de cartes avec plus de 30 noeuds.
- Retention 7/30 jours.

### Phase 3 - Recurrent

But : devenir un endroit de travail regulier.

- Bibliotheque locale/cloud.
- Sync.
- Templates.
- AI utile mais non intrusive.
- Exports PDF/SVG propres.

Mesure :

- Cartes actives par utilisateur.
- Reouvertures par carte.
- Conversion Pro.

## 11. Decision strategic

Le projet a du sens s'il assume un espace plus etroit que Xmind et Whimsical :

- pas une suite complete de mindmapping ;
- pas un board collaboratif ;
- pas un plugin Obsidian ;
- mais un outil de pensee structuree, local-first, Markdown-native, beau et instantane.

La these forte :

Il existe un espace entre "je prends une note" et "j'ouvre un outil de diagramme". Cet espace est mal servi. Xmind est trop outil de mindmap, Whimsical est trop workspace collaboratif, MarkMind est trop Obsidian/plugin. Mosaic peut occuper ce moment precis ou l'utilisateur veut clarifier sans s'engager.

La condition :

La qualite de l'outliner et du round-trip Markdown doit etre non negociable. Si Mosaic n'est pas meilleur qu'un simple paste dans Xmind ou Whimsical sur la rapidite et la portabilite, il perd son avantage.

Recommandation finale :

Construire Mosaic comme un produit gratuit-local d'abord, avec un chemin Pro individuel. Ne pas prioriser collaboration/Gantt/presentation au debut. Documenter le format. Vendre la confiance, la vitesse et le calme. L'objectif initial n'est pas de remplacer Xmind : c'est de devenir le reflexe quand une idee a besoin d'une structure en moins d'une minute.
