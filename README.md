# High-Performance N-Body Simulator (Barnes-Hut Algorithm)

This a 3D interactive $N$-body web simulator optimized, designed as a fun computational astrophysics project, which implements advance concepts and browser performance improvements.

## 🚀 Project Arquitecture (Monorepo)

The project is structured as a monorepo to keep track of the responsabilities clearly. 

* **`packages/core`**: The pure physics engine. Contains the Octree data structure from scratch, the Barnes-Hut algorithm and the orbital numerical integrators. It is 100% agnostic from environment (pure mathematics).
* **`packages/worker`**: The execution environment in backstage (**Web Worker**). Executes the physics loop in parallel to avoid main thread blocking in the UI.
* **`packages/web-app`**: The UI/UX. Build in **TypeScript** and **Three.js (WebGL)** to render particles at 60 FPS, among a minimalistic UI to show real-time parameters.

## 🛠️ Tech Stack

* **Language:** TypeScript (Strict Mode)
* **Graphs:** Three.js / WebGL
* **Parallelization:** Web Workers API / Transferable Objects
* **Project Management:** NPM Workspaces