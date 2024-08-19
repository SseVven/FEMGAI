class Matrix {
    // 输入三维向量，输出任一垂直单位向量
    static getPerpendicularUnitVector(v) {
        // Destructure the input vector
        let [vx, vy, vz] = v;

        // Choose a vector that is not parallel to v
        let w;
        if (Math.abs(vx) > Math.abs(vy)) {
            w = [vy, -vx, 0];
        } else {
            w = [0, -vz, vy];
        }

        // Calculate the cross product to get a perpendicular vector
        let ux = vy * w[2] - vz * w[1];
        let uy = vz * w[0] - vx * w[2];
        let uz = vx * w[1] - vy * w[0];
        let u = [ux, uy, uz];

        // Normalize the perpendicular vector to make it a unit vector
        let length = Math.sqrt(ux * ux + uy * uy + uz * uz);
        u = u.map(component => component / length);

        return u;
    }
    // 输入:三维向量a,b,数字deg，输出:b绕a旋转deg°后的向量// 右手定则
    static rotateVectorAroundAxis(a, b, deg) {
        // Convert degrees to radians
        let rad = deg * (Math.PI / 180);

        // Normalize vector a
        let lengthA = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        let u = a.map(component => component / lengthA);

        let ux = u[0], uy = u[1], uz = u[2];

        // Calculate the cosine and sine of the angle
        let cosTheta = Math.cos(rad);
        let sinTheta = Math.sin(rad);

        // Rodrigues' rotation formula components
        let oneMinusCosTheta = 1 - cosTheta;
        let dotProduct = ux * b[0] + uy * b[1] + uz * b[2];

        let rotatedX = (cosTheta + ux * ux * oneMinusCosTheta) * b[0] +
            (ux * uy * oneMinusCosTheta - uz * sinTheta) * b[1] +
            (ux * uz * oneMinusCosTheta + uy * sinTheta) * b[2];

        let rotatedY = (uy * ux * oneMinusCosTheta + uz * sinTheta) * b[0] +
            (cosTheta + uy * uy * oneMinusCosTheta) * b[1] +
            (uy * uz * oneMinusCosTheta - ux * sinTheta) * b[2];

        let rotatedZ = (uz * ux * oneMinusCosTheta - uy * sinTheta) * b[0] +
            (uz * uy * oneMinusCosTheta + ux * sinTheta) * b[1] +
            (cosTheta + uz * uz * oneMinusCosTheta) * b[2];

        return [rotatedX, rotatedY, rotatedZ];
    }
    
    constructor(center = null, rotate = null) {
        this.center = center || [0, 0, 0];
        this.matrix = rotate || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    apply(vector3) {

    }

    applys(vector3s) {

    }
}
export default Matrix;
