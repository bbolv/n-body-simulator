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

    public static readonly G: number = 1.0; // Gravitational constant normalized to 1
    public static readonly THETA: number = 0.5; //Barnes-Hut approximation threshold
    public static readonly SOFTENING = 0.15 // Softening parameter to avoid division by zero (singularities)

    /**
     * Compute the net gravitational force on a target particle due to all particles in the subtree.
     * @param target The particle to compute the force on
     * @returns The net gravitational force vector on the target particle
     */
    public computeForce(target: Particle): Vector3D {
        let netForce = new Vector3D(0,0,0);

        // If the node is empyt or it is the same particle, there is no force to compute
        if (this.totalMass === 0 || (this.body && this.body.id === target.id)) return netForce;

        // Case 1: The node is a leaf (a single particle)
        if (this.isLeaf() && this.body) {
            return this.calculatePairwiseForce(target, this.body.position, this.body.mass);
        }

        // Case 2: The node is an internal node (has children). Compute the Barnes-Hut criterion
        const distanceVector = this.centerOfMass.sub(target.position);
        const distance = distanceVector.magnitude();

        if (distance === 0) return netForce; // Avoid division by zero
        
        const s = this.boundary.halfLength * 2; // Width of the cube 

        //It is reasonable to approximate the node as a single particle: We are sufficiently far away
        if (s / distance < OctreeNode.THETA) {
            return this.calculatePairwiseForce(target, this.centerOfMass, this.totalMass);
        }

        // Otherwise, we need to sum the forces from all children
        if (this.children) {
            for (const child of this.children) {
                netForce = netForce.add(child.computeForce(target));
            }
        }

        return netForce;
    }

    /**
     * Compute the pairwise gravitational force between a target particle and a source particle.
     * @param target The particle to compute the force on
     * @param sourcePos The position of the source particle
     * @param sourceMass The mass of the source particle
     * @returns The pairwise gravitational force vector between the target and source particles
     */
    private calculatePairwiseForce (target: Particle, sourcePos: Vector3D, sourceMass: number): Vector3D {
        const direction = sourcePos.sub(target.position);
        const distanceSq = direction.magnitudeSq();

        // Compute the softened distance to avoid division by zero
        const softenedDistanceSq = distanceSq + (OctreeNode.SOFTENING ** 2);
        const distance = Math.sqrt(softenedDistanceSq);

        // Apply Newtonian gravitational force law: F = G * (m1 * m2) / r^2
        const forceMagnitude = (OctreeNode.G * target.mass * sourceMass) / distanceSq;

        // Return the force vector in the direction of the source particle: magnitude * normalized direction
        return direction.scale(forceMagnitude / distance);
    }
}