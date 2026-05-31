# High-Performance N-Body Simulator (Barnes-Hut Algorithm)

**[English](#english)** · **[Español](#español)**

---

<a id="english"></a>

## English

3D interactive $N$-body web simulator optimized, designed as a fun computational astrophysics project, which implements advance concepts and browser performance improvements.

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

---

<a id="español"></a>

## Español

Este es un simulador de $N$-cuerpos interactivo en 3D optimizado para la web, diseñado como un proyecto divertido de astrofísica computacional, que muestra conceptos avanzados y optimización de rendimiento en el navegador.

## 🚀 Arquitectura del Proyecto (Monorepo)

El proyecto está estructurado como un monorepo para mantener una separación clara de responsabilidades:

* **`packages/core`**: El motor de física puro. Contiene la implementación desde cero de la estructura de datos **Octree**, el algoritmo de aproximación de **Barnes-Hut** y los integradores numéricos orbitales. Es 100% agnóstico del entorno (matemáticas puras).
* **`packages/worker`**: El entorno de ejecución en segundo plano (**Web Worker**). Ejecuta el bucle de física de forma paralela para evitar bloquear el hilo principal de la interfaz de usuario.
* **`packages/web-app`**: La capa visual y de interacción. Construida con **TypeScript** y **Three.js (WebGL)** para el renderizado de partículas a 60 FPS, junto con una interfaz de usuario minimalista para modificar parámetros en tiempo real.

## 🛠️ Stack Tecnológico

* **Lenguaje:** TypeScript (Strict Mode)
* **Renderizado Gráfico:** Three.js / WebGL
* **Paralelismo:** Web Workers API / Transferable Objects
* **Gestión de Proyecto:** NPM Workspaces