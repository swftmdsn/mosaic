# Rebuild Tauri

Ce document décrit la procédure pour reconstruire l'application desktop Mosaic avec Tauri.

## Pré-requis

- Se placer à la racine du projet :

```bash
cd /Users/matthieupirat/Desktop/PROJECTS/mosaic
```

- Avoir les dépendances Node installées :

```bash
npm install
```

- Avoir Rust et l'environnement macOS de build disponibles. Pour macOS, Xcode Command Line Tools doit être installé.

## Rebuild complet

Lancer la commande prévue dans `package.json` :

```bash
npm run tauri:build
```

Cette commande exécute :

1. `tauri build --bundles app dmg`
2. Le `beforeBuildCommand` défini dans `src-tauri/tauri.conf.json`
3. `npm run build`
4. `tsc --noEmit`
5. `vite build`
6. La compilation Rust en mode release
7. Le bundling Tauri en `.app` et `.dmg`

## Artefacts générés

Après un build réussi, les principaux fichiers sont :

```text
src-tauri/target/release/mosaic
src-tauri/target/release/bundle/macos/Mosaic.app
src-tauri/target/release/bundle/dmg/Mosaic_0.1.0_aarch64.dmg
```

Le `.app` est l'application macOS. Le `.dmg` est l'image disque distribuable.

## Build `.app` seulement

Si le DMG échoue mais que l'application macOS suffit :

```bash
npm run tauri -- build --bundles app
```

L'artefact attendu est :

```text
src-tauri/target/release/bundle/macos/Mosaic.app
```

## Build universel macOS

Pour produire un build universel Apple Silicon + Intel :

```bash
npm run tauri:build:universal
```

Cette commande utilise :

```bash
tauri build --target universal-apple-darwin --bundles app dmg
```

## Diagnostic en cas d'erreur DMG

Si la compilation frontend et Rust réussit mais que le bundling DMG échoue, relancer en mode verbeux :

```bash
npm run tauri -- build --bundles dmg --verbose
```

Points à vérifier :

- Le `.app` existe bien dans `src-tauri/target/release/bundle/macos/Mosaic.app`.
- Aucun ancien volume DMG Mosaic n'est monté dans Finder.
- Aucun fichier temporaire `rw.*.Mosaic_*.dmg` ne bloque dans `src-tauri/target/release/bundle/macos`.
- Les outils macOS `hdiutil`, `osascript` et Xcode Command Line Tools sont disponibles.

Si seul le DMG pose problème, reconstruire en `.app` uniquement permet généralement de continuer à tester l'application.

## Lancer en développement

Pour lancer Tauri en mode développement :

```bash
npm run tauri:dev
```

Cette commande démarre Vite via `beforeDevCommand` puis ouvre l'application Tauri.
