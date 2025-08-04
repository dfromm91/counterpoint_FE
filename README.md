# CounterCraft

A TypeScript-based rendering engine for a turn-based **First Species Counterpoint** application. This project is an abstraction over the HTML5 Canvas API, enabling interactive creation, display, and editing of musical notation.

The app is designed with the future intent of supporting a game-like experience where users take turns placing notes in accordance with the rules of counterpoint. Currently, it includes full support for drawing and erasing notes, creating staves, and rendering various musical elements.

## 🧱 Architecture

The codebase follows a modular layered architecture:

- **Model Layer**: Defines musical concepts like notes, staves, and score.
- **Layout Layer**: Determines the spatial arrangement of musical elements.
- **Rendering Layer**: Converts layout instructions into drawing commands on the canvas.
- **Controller Layer**: Manages user interactions and updates the underlying model.

## 📁 Project Structure

```
cc_refactor/
├── dist/                # Output folder containing index.html and compiled JavaScript
│   ├── index.html
│   ├── main.js
│   └── layout/          # Compiled layout/rendering code
├── src/                 # TypeScript source code (models, rendering, layout, controller)
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project metadata and dependencies
├── .gitignore
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npx tsc --project tsconfig.json
```

This will compile everything from `src/` to `dist/`.

### 3. View the output

Open `dist/index.html` in a web browser to interact with the music rendering canvas.

## ⚙️ Configuration

The TypeScript compiler is configured via `tsconfig.json`, which specifies `src` as the root directory and `dist` as the output directory.
