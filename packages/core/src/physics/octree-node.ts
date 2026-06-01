import { Vector3D } from '../math/vector3d.js';
import { Particle } from './particle.js';
import { BoundingBox3D } from './bounding-box.js';

export class OctreeNode {
    // Nodes geometry
    public readonly boundary: BoundingBox3D;

    // Data status inside the node
    public body: Particle | null = null;
    public children: OctreeNode[] | null = null;

    // Added physical properties (Key for Barnes-Hut)
    public totalMass: number = 0;
    public centerOfMass: Vector3D = new Vector3D(0,0,0);

    constructor(boundary: BoundingBox3D) {
        this.boundary = boundary
    }

    /**
     * A node is considered a leaf if it has no children
     * @returns 
     */
    public isLeaf(): boolean {
        return this.children === null;
    }

    public subdivide(): void {
        const c: Vector3D = this.boundary.center;
        // The new children size will be half of the current size
        const newHalfLength: number = this.boundary.halfLength / 2;

        this.children = [];

        // Generate the 8 posible sign combinations for axles (X, Y, Z)
        // [False = Substract, True = Sum]
        for (let i = 0; i < 8; i++) {
            // Use bits to get the combinations
            // i = 0 (000) -> -X, -Y, -Z
            // i = 7 (111) -> +X, +Y, +Z
            const xSign: number = (i & 1) ? 1 : - 1;
            const ySign: number = (i & 2) ? 1 : - 1;
            const zSign: number = (i & 4) ? 1 : - 1;

            const newCenter: Vector3D = new Vector3D(
                c.x + xSign * newHalfLength,
                c.y + ySign * newHalfLength,
                c.z + zSign * newHalfLength
            );

            const subBoundary = new BoundingBox3D(newCenter, newHalfLength);
            this.children.push(new OctreeNode(subBoundary));
        }
    }

    public insert(particle: Particle): boolean {
        // Case 0: If the particle does not belongs geometrically to this cube, ignore it.
        if (!this.boundary.contains(particle.position)) {
            return false;
        }

        // Update total mass and the center of mass
        // This is the real time update of the sum:
        // New center of mass (M_curr * R_curr + m_new * r_new) / (M_curr + m_new)
        const oldMass: number = this.totalMass;
        this.totalMass += particle.mass;

        if (oldMass == 0) {
            this.centerOfMass = particle.position; //The system has no mass before, the center of mass, after adding a new particle will be simply its position
        } else {
            const currentMomentum: Vector3D = this.centerOfMass.scale(oldMass);
            const newParticleMomentum: Vector3D = particle.position.scale(particle.mass);
            this.centerOfMass = currentMomentum.add(newParticleMomentum).scale(1 / this.totalMass);
        }

        // Case 1: The node is completely empty ( and is a leaf )
        if (this.body === null && this.isLeaf()) {
            this.body = particle;
            return true
        }

        // Case 2: The node already is an intern node (has children)
        if (!this.isLeaf()) {
            // Search which son must adopt the particle
            for (const child of this.children!) {
                if(child.insert(particle)) return true;
            }
            return false;
        }

        // Case 3: The node was a leaf but it has already a particle
        // Two stars must no live inside the same leaf node
        if (this.body !== null) {
            const existingParticle = this.body;
            this.body = null; // The node stops saving a direct particle and it changes to an intern node

            // Slice the space in 8 children
            this.subdivide();

            // Re-insert recursively both particles in the new sub-cubes
            for (const child of this.children!) {
                child.insert(existingParticle);
            }

            for (const child of this.children!) {
                if (child.insert(particle)) return true;
            }
        }

        return false;
    }
}