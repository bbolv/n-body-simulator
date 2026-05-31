# High-Performance N-Body Simulator (Barnes-Hut Algoritm)

Este es un simulador de $N$-cuerpos interactivo en 3D optimizado para la web, diseñado para demostrar conceptos avanzados de astrofísica computacional, estructuras de datos y optimización de rendimiento en el navegador.

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