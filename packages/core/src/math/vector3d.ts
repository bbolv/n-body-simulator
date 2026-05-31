export class Vector3D {
    // The 'readonly' modifiers ensure the immutability at compilation level
    constructor(
        public readonly x: number = 0,
        public readonly y: number = 0,
        public readonly z: number = 0,
    ){}

    /**
     * 
     * @param v 
     * @returns Rerturns a new vector which is the sum of this vector and another
     */
    public add (v: Vector3D): Vector3D {
        return new Vector3D ( this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * 
     * @param v 
     * @returns Rerturns a new vector which is the sub of this vector and another
     */
    public sub( v: Vector3D): Vector3D {
        return new Vector3D ( this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * 
     * @param scalar 
     * @returns Returns a new vector which is the scalar product between this vector and a scalar
     */
    public scale (scalar: number): Vector3D {
        return new Vector3D (this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * 
     * @param v 
     * @returns Returns the dot product between this vector and and another vector
     */
    public dot (v: Vector3D): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * 
     * @returns Returns the square magnitude of this vector. Note the avoid of square root computation
     */
    public magnitudeSq (): number {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    /**
     * 
     * @returns Returns the norm of this vector 
     */
    public magnitude (): number {
        return Math.sqrt(this.magnitudeSq());
    }

    /**
     * 
     * @param v 
     * @returns Returns the distance of the this vector and another vetor. This will be used by the gravitation law
     */
    public distanceSq (v: Vector3D): number {
        const dx: number = this.x - v.x;
        const dy: number = this.y - v.y;
        const dz: number = this.z - v.z;
        return dx ** 2 + dy ** 2 + dz ** 2;
    }

    /**
     * 
     * @returns Returns a normalized vector (magnitude equals to 1) but same direction. If the vector is zero, then return the origin to avoid non-defined operations
     */
    public normalize (): Vector3D {
        const mag = this.magnitude();
        if (mag === 0) return new Vector3D(0,0,0);
        return new Vector3D(this.x / mag, this.y / mag, this.z / mag);
    }

    /**
     * 
     * @returns Returns a safety clone of this vector
     */
    public clone (): Vector3D {
        return new Vector3D(this.x, this.y, this.z);
    }
}

