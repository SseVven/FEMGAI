import { math } from "./math";

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
        // let dotProduct = ux * b[0] + uy * b[1] + uz * b[2];

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
    // 绕 a 轴旋转矩阵
    static getRotateMatrix(a, deg) {
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

        return [
            [cosTheta + ux * ux * oneMinusCosTheta, ux * uy * oneMinusCosTheta - uz * sinTheta, ux * uz * oneMinusCosTheta + uy * sinTheta],
            [uy * ux * oneMinusCosTheta + uz * sinTheta, cosTheta + uy * uy * oneMinusCosTheta, uy * uz * oneMinusCosTheta - ux * sinTheta],
            [uz * ux * oneMinusCosTheta - uy * sinTheta, uz * uy * oneMinusCosTheta + ux * sinTheta, cosTheta + uz * uz * oneMinusCosTheta]
        ];
    }

    constructor(center = null, rotate = null, scale = null) {
        this.center = center || [0, 0, 0];
        this.rotate = rotate || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        this.scale = scale || [1, 1, 1];
    }

    apply(vector3) {

    }

    applys(vector3s) {

    }

    getRotate() {
        return this.rotate;
    }

    getScale() {
        return this.scale;
    }

    getTransMatrix4x4() {
        return [[1, 0, 0, this.center[0]], [0, 1, 0, this.center[1]], [0, 0, 1, this.center[2]], [0, 0, 0, 1]];
    }
    getRotateMatrix4x4() {
        const res = [];
        for (let i = 0; i < 3; i++) {
            res.push([]);
            for (let j = 0; j < 3; j++)
                res[i].push(this.rotate[i][j]);
            res[i].push(0);
        }
        res.push([0, 0, 0, 1]);

        return res;
    }
    getScaleMatrix4x4() {
        return [[this.scale[0], 0, 0, 0], [0, this.scale[1], 0, 0], [0, 0, this.scale[2], 0], [0, 0, 0, 1]];
    }
    getMatrix4x4() {
        // 位移矩阵*旋转矩阵*放缩矩阵
        const mat4x4 = this.matrix4x4Times(this.getTransMatrix4x4(), this.getRotateMatrix4x4(), this.getScaleMatrix4x4());
        const res = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res.push(mat4x4[i][j]);
            }
        }
        return res;
    }

    translate(vec3) {
        for (let i = 0; i < 3; i++)
            this.center[i] += vec3[i];
    }

    rotateMatrix(matrix) {
        const copy = this.newMatrix(3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cnt = 0;
                for (let k = 0; k < 3; k++)
                    cnt += matrix[i][k] * this.rotate[k][j];
                copy[i][j] = cnt;
            }
        }
        this.copyMatrix(copy, this.rotate);
    }

    matrix4x4Times() {
        const res = this.newMatrix(4);
        const tmp = this.newMatrix(4);
        this.copyMatrix(arguments[0], tmp);
        for (let w = 1; w < arguments.length; w++) {
            const mat = arguments[w];

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    let cnt = 0;
                    for (let k = 0; k < 4; k++)
                        cnt += tmp[i][k] * mat[k][j];
                    res[i][j] = cnt;
                }
            }
            this.copyMatrix(res, tmp);
        }
        return res;
    }

    newMatrix(n) {
        const res = [];
        for (let i = 0; i < n; i++) {
            res.push([]);
            for (let j = 0; j < n; j++) {
                res[i].push(0);
            }
        }
        return res;
    }
    copyMatrix(from, to) {
        for (let i = 0; i < from.length; i++) {
            for (let j = 0; j < from[i].length; j++) {
                to[i][j] = from[i][j];
            }
        }
    }
}
export default Matrix;
