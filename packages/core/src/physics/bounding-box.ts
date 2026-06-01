import { Vector3D } from "../math/vector3d.js";

export class BoundingBox3D {
    /**
     * 
     * @param center The geometrical center of the cube (x, y, z)
     * @param halfLength The half of the width, height and depth of the cube
     * Math cmputations are easily handled with the half length
     */
    constructor (
        public readonly center: Vector3D,
        public readonly halfLength: number
    ) {
        if (halfLength <= 0) {
            throw new Error ("The size of the BoundingBox must be grater than zero.");
        }
    }

    /**
     *  Verifies if a position (vector) is contained inside this cube
     * @param point 
     * @returns 
     */
    public contains (point: Vector3D): boolean {
        return (
            point.x >= this.center.x - this.halfLength &&
            point.x <= this.center.x + this.halfLength &&
            point.y >= this.center.y - this.halfLength &&
            point.y <= this.center.y + this.halfLength &&
            point.z >= this.center.z - this.halfLength &&
            point.z <= this.center.z + this.halfLength
        )
    }
}