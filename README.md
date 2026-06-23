# Mosaic

Mosaic is a visual thinking space for turning fuzzy ideas into clear structures.

It combines the speed of an outline, the readability of a mind map, and the elegance of a modern work tool. You can write, organize, move, collapse, connect, and visualize your ideas without changing context.

## Think more clearly

Mosaic is designed for moments when a simple note becomes too flat, and when a traditional mind map becomes too rigid.

Use it to:

- structure a complex project;
- prepare a presentation, workshop, or strategy;
- organize research, monitoring, or a knowledge system;
- clarify a decision with its branches, assumptions, and consequences;
- turn a brainstorming session into an actionable outline;
- move from a high-level vision to a list of concrete actions;
- keep a lasting record of your reasoning.

## Two ways to see the same idea

Mosaic lets you move naturally between an outline view and a mind map view.

The outline view is made for writing quickly, reorganizing a hierarchy, moving an idea up or down, isolating a branch, and moving forward without friction.

The mind map view gives you distance. It makes relationships visible, shows overloaded areas, reveals weak branches, and helps you find the thread of a system of ideas again.

Both views tell the same story at two different rhythms: precision when you write, perspective when you explore.

## A tool for working, not decorating

Mosaic aims for a dense, calm, and premium experience.

The interface keeps content first: floating menus, quick actions, shortcuts that appear when useful, discreet panels, light mode, and dark mode. Every detail is meant to reduce friction instead of adding spectacle.

The design is inspired by the best modern productivity tools: readable like Notion, sharp like Linear, minimal without feeling empty, precise without becoming cold.

## What Mosaic helps you produce

Mosaic is not just a tool for drawing maps. It is a tool for moving a thought forward.

It helps you produce:

- clearer project outlines;
- idea architectures that are easier to explain;
- better organized presentation materials;
- navigable research maps;
- more readable roadmaps and decisions;
- notes that remain reusable after the thinking phase.

## For minds that think in systems

Mosaic is for people who handle a lot of information and need to see the relationships between things.

Product, strategy, research, design, writing, teaching, consulting, entrepreneurship: the shared trait is not the job, but the way of thinking. Mosaic is made for people who build trees, test angles, move blocks, compare options, and look for the right shape for an idea.

## A local, personal, and durable feel

Mosaic respects the rhythm of individual work: no account required to start, no imposed collaborative noise, no useless dashboard before writing.

Your maps remain objects you can store, find, version, share, or archive. The tool supports your work system instead of locking it in.

## The promise

Mosaic wants to become the calm desk where an idea can take shape.

A place where you start with a few lines, expand a structure, visualize the connections, then leave with a clear plan.

Think. Structure. See. Take back control.

## Development

Mosaic is a Vite/TypeScript application packaged as a macOS desktop app with Tauri 2.

Local prerequisites:

- Node.js compatible with `^20.19.0 || >=22.12.0`;
- npm;
- Rust and Cargo;
- Xcode Command Line Tools on macOS.

Install dependencies:

```sh
npm ci
```

Run the web development version:

```sh
npm run dev
```

Run Mosaic as a macOS desktop app with Tauri:

```sh
npm run tauri:dev
```

Build the frontend only:

```sh
npm run build
```

Build the Tauri macOS bundles (`.app` and `.dmg`):

```sh
npm run tauri:build
```

The generated bundles are located in:

- `src-tauri/target/release/bundle/macos/Mosaic.app`
- `src-tauri/target/release/bundle/dmg/Mosaic_0.1.0_aarch64.dmg`

For a universal Apple Silicon + Intel macOS build, use:

```sh
npm run tauri:build:universal
```

## License

This project is proprietary and published for review only. See [LICENSE](LICENSE).
