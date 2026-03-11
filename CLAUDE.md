# Vaults of the Forgotten Architect

## Project Overview
3D Sokoban-style puzzle game built with Three.js. The player pushes energy cores onto power plates to reactivate ancient chambers. Deployed on GitHub Pages.

## Tech Stack
- **Three.js** (v0.183) - 3D rendering + post-processing
- **Vite** (v7) - bundler and dev server
- **Vanilla JS** - ES modules, no framework

## Commands
- `npm run dev` - start dev server
- `npm run build` - build to `docs/` for GitHub Pages
- `npm run preview` - preview production build

## Project Structure
```
src/
  main.js        - Three.js setup, scene, renderer, input handling (keyboard + touch)
  game.js        - Core Sokoban logic, undo system, win detection, level progression
  grid.js        - Grid rendering (floors, walls, plates), cell types, coordinate conversion
  player.js      - Player mesh (octahedron), movement animation
  block.js       - Energy core mesh (cube), push animation, on-plate visual state
  particles.js   - Particle systems (ambient, energy rings, celebration burst)
  levelLoader.js - Parses level data into game state (player, blocks, plates positions)
  camera.js      - Orthographic isometric camera, OrbitControls config, snap rotation
  materials.js   - Shared materials and color palette constants
  ui.js          - DOM UI (level name, move counter, title screen, level complete overlay, level intro overlay)
  style.css      - Dark theme with neon blue/purple palette
  levels/
    index.js     - 5 levels defined as 2D grid arrays with narrative text
docs/            - Built output served by GitHub Pages (do NOT gitignore)
```

## Level Format
Levels are 2D arrays in `src/levels/index.js`. Cell types:
- 0=void, 1=wall, 2=floor, 3=plate, 4=player start, 5=block, 6=block on plate

Each level also has:
- `description` - lore text shown in intro overlay before playing
- `completionText` - narrative text shown on level completion

## Deployment
- Build output goes to `docs/` folder
- GitHub Pages serves from `docs/` on `main` branch
- Base path is `/3js/` (configured in `vite.config.js`)
- Always run `npm run build` before committing deployment changes

## Key Design Decisions
- Orthographic camera for clean isometric look; OrbitControls for rotation/zoom
- Movement direction is transformed by camera azimuth angle (snapped to 90-degree increments)
- Mobile: virtual D-pad + action buttons; camera rotation via dedicated snap buttons (free touch rotation disabled to prevent camera getting stuck on walls)
- Desktop: Q/E keys for 90-degree camera snap rotation, mouse drag for free rotation
- Level progress saved in localStorage (`vaults_progress`)
- Smooth movement animations (150ms ease-in-out) with player hop effect
- Camera smoothly follows player position (lerp factor 0.15)

## Visual Pipeline
- **Post-processing**: EffectComposer with UnrealBloomPass, VignetteShader, OutputPass
- **Bloom**: strength=0.6, radius=0.3, threshold=0.25 - makes emissive materials glow
- **Particles**: AmbientParticles (floating dust), EnergyRing (orbiting around blocks/player), CelebrationBurst (win effect)
- **Tone mapping**: ACESFilmicToneMapping with exposure=1.4
- **Materials**: High emissiveIntensity values on blocks/plates/player to interact with bloom
- **Grid**: Ground plane with grid lines extends beyond level; wall accent lines where walls face floors
