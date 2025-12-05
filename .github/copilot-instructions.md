# Copilot Instructions for Flappy Bird Clone

## Project Overview
- This is a simple Flappy Bird clone built with HTML5 Canvas and JavaScript, served via a Node.js static server.
- The main gameplay logic is in `main.js`, rendering to a `<canvas>` in `index.html`.
- The server (`server.js`) only serves static files; there is no backend game logic or persistent storage.

## Architecture & Data Flow
- **Frontend only:** All game logic, rendering, and state are managed in the browser (`main.js`).
- **Game loop:** Uses `requestAnimationFrame` for smooth animation and updates.
- **State:** Bird position, velocity, pipes, score, and game state are managed as top-level variables in `main.js`.
- **Assets:** All graphics are drawn programmatically; no external images or sounds.

## Developer Workflows
- **Start server:** Run `npm start` or `node server.js` to serve the game at [http://localhost:8082](http://localhost:8082).
- **No build step:** There is no transpilation or bundling; edit JS/HTML/CSS directly.
- **No tests:** There are currently no automated tests or test scripts.
- **Debugging:** Use browser dev tools for JS debugging and canvas inspection.

## Project-Specific Patterns
- **Game state reset:** The `resetGame()` function in `main.js` is used to restart the game after game over.
- **Pipe spawning:** Pipes are managed in an array and spawned based on distance from the last pipe.
- **Input handling:** Only the spacebar (`keydown` event) is used for game control.
- **Score tracking:** Score and high score are tracked in-memory; not persisted.

## Integration Points & Dependencies
- **Node.js server:** Only dependency is Node's built-in `http`, `fs`, and `path` modules. No external npm packages are used.
- **No external APIs:** The game is fully self-contained; no network calls or external integrations.

## Conventions & Recommendations
- **Keep logic in `main.js`:** All gameplay features should be implemented in `main.js` unless refactoring for modularity.
- **UI changes:** Update `index.html` for layout or canvas changes; style directly in `<style>` or via JS.
- **Add new features:** Follow the pattern of top-level state variables and functions for new mechanics.
- **For new assets:** Prefer drawing with canvas API rather than adding image files.

## Key Files
- `main.js`: Game logic, rendering, and input handling.
- `index.html`: Canvas setup and script loading.
- `server.js`: Static file server for local development.
- `package.json`: Defines the start script; no dependencies.

---

For questions or changes to these instructions, clarify which workflow or pattern is unclear or missing.
