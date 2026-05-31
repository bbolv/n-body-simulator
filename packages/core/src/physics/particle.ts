import { Vector3D } from "../math/vector3d.js";

export class Particle {
    // Save an id for each star (helps to render)
    public readonly id: string;
    public readonly mass: number;

    //This properties change in every frame in the simulation
    public position: Vector3D;
    public velocity: Vector3D;

    constructor(id: string, mass: number, position: Vector3D, velocity: Vector3D = new Vector3D()) {
        //Fundamental physics:
        if(mass <= 0) {
            throw new Error (`The mass of the particle must be grater than zero: Received: ${mass}`);
        }

        this.id = id;
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
    }

    /**
     * Update the position of the particle from the current velocity and a delta in time.
     * Cinematic integration: x = x0 + v * dt
     * @param dt delta of time
     */
    public updatePosition(dt: number): void {
        const deltaPos = this.velocity.scale(dt); //Get the delta position in each direction (dx, dy, dz)
        this.position = this.position.add(deltaPos); //Update the position with the deltaPos
    }

    /**
     * Update the velocity of the particle based on a applied force and a delta time dt
     * Use the Newton Second Law, explicit version: a = F / m, then v = v0 + a * dt
     * @param force Force applied
     * @param dt delta of time
     *
     */
    public applyForce(force: Vector3D, dt: number): void {
        if (this. mass === 0) return; 

        const acceleration = force.scale(1 / this.mass);
        const deltaVel = acceleration.scale(dt);
        this.velocity = this.velocity.add(deltaVel);
    }

    /**
     * 
     * @returns Returns an exactly copy of the particle to avoid accidentally mutations when transfering data between modules or threads
     */
    public clone() : Particle {
        return new Particle (
            this.id,
            this.mass,
            this.position.clone(),
            this.velocity.clone()
        )
    }
}