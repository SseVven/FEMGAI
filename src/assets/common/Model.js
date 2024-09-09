import Matrix from "./Matrix";
import { math } from './math';

import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';

class Model {
    static defaultParams = [
        {
            XLen: 1,
            YLen: 1,
            ZLen: 1,
        },
        {
            radius: 1,
            height: 1,
            resolution: 300,
        },
        {
            radius: 1,
            height: 1,
            resolution: 300,
        },
        {
            radius: 1,
            resolution: 300,
        }
    ]
    constructor(type, params, matrix = null) {
        this.type = type;
        this.params = params || Model.defaultParams[type];
        this.matrix = matrix || new Matrix();
        this.data = vtkPolyData.newInstance();
        this.points = [];
        this.polys = [];

        // 精度几何信息
        this.vertices = []; // 模型的几何顶点
        this.lines = []; // 模型的几何边

        this.exportPolyData();
    }

    // 根据参数 this.params 生成对应的 vtkpolydata 以供渲染 
    // 渲染记得带上变换矩阵 matrix 
    exportPolyData(isReset = true, mode = [1, 0, 0, 0]) {
        if (!isReset) {
            return this.data;
        }
        this.points = [];
        this.polys = [];
        if (this.type == 0) {
            this.points = [[0, 0, 0], [this.params.XLen, 0, 0], [0, 0, this.params.ZLen], [this.params.XLen, 0, this.params.ZLen], [0, this.params.YLen, 0], [this.params.XLen, this.params.YLen, 0], [0, this.params.YLen, this.params.ZLen], [this.params.XLen, this.params.YLen, this.params.ZLen]];
            this.polys = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [1, 3, 7, 5], [2, 3, 7, 6], [2, 0, 4, 6]];
            this.vertices = [0, 1, 2, 3, 4, 5, 6, 7];
            this.lines = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [3, 7], [2, 6]];
        }
        else if (this.type == 1) {
            const APoint = [this.params.height, 0, 0];
            const CPoint = [0, 0, this.params.radius];
            const interalDeg = 360 / this.params.resolution;
            this.points.push(APoint);
            const btm = [];
            for (let i = 0; i < this.params.resolution; i++) {
                this.points.push(Matrix.rotateVectorAroundAxis(APoint, CPoint, interalDeg * i));
                if (i == this.params.resolution - 1)
                    this.polys.push([0, i + 1, 1]);
                else
                    this.polys.push([0, i + 1, i + 2]);
                btm.push(i + 1);
            }
            this.polys.push(btm);
            this.vertices = [0];
        }
        else if (this.type == 2) {
            const direct = [this.params.height, 0, 0];
            const CPoint = [0, 0, this.params.radius];
            const interalDeg = 360 / this.params.resolution;
            const top = [];
            const btm = [];
            for (let i = 0; i < this.params.resolution; i++) {
                let tmp = Matrix.rotateVectorAroundAxis(direct, CPoint, interalDeg * i);
                this.points.push(tmp);
                this.points.push(tmp.map((v, k) => v + direct[k]));

                if (i == this.params.resolution - 1)
                    this.polys.push([2 * i, 2 * i + 1, 1, 0]);
                else
                    this.polys.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);

                btm.push(2 * i);
                top.push(2 * i + 1);
            }
            this.polys.push(btm);
            this.polys.push(top);
        }
        else if (this.type == 3) {
            const CPoint = [this.params.radius, 0, 0];
            const DPoint = [-this.params.radius, 0, 0];
            const interalDeg1 = 180 / this.params.resolution;
            const interalDeg = 360 / this.params.resolution;

            this.points.push(CPoint);
            for (let i = 1; i < this.params.resolution; i++) {
                let tmp = Matrix.rotateVectorAroundAxis([0, 1, 0], CPoint, interalDeg1 * i);
                for (let j = 0; j < this.params.resolution; j++) {
                    let tmp2 = Matrix.rotateVectorAroundAxis([1, 0, 0], tmp, interalDeg * j);

                    this.points.push(tmp2);
                }
            }
            this.points.push(DPoint);

            for (let i = 0; i < this.params.resolution; i++) {
                if (i == this.params.resolution - 1) {
                    this.polys.push([0, i + 1, 1]);
                    this.polys.push([this.params.resolution * (this.params.resolution - 1) + 1, (this.params.resolution - 2) * this.params.resolution + i + 1, (this.params.resolution - 2) * this.params.resolution + 1]);
                }
                else {
                    this.polys.push([0, i + 1, i + 2]);
                    this.polys.push([this.params.resolution * (this.params.resolution - 1) + 1, (this.params.resolution - 2) * this.params.resolution + i + 1, (this.params.resolution - 2) * this.params.resolution + i + 2]);
                }
            }

            for (let i = 0; i < this.params.resolution - 2; i++) {
                for (let j = 0; j < this.params.resolution; j++) {
                    if (j == this.params.resolution - 1)
                        this.polys.push([i * this.params.resolution + j + 1, i * this.params.resolution + 1, (i + 1) * this.params.resolution + 1, (i + 1) * this.params.resolution + j + 1]);
                    else
                        this.polys.push([i * this.params.resolution + j + 1, i * this.params.resolution + j + 2, (i + 1) * this.params.resolution + j + 2, (i + 1) * this.params.resolution + j + 1]);
                }
            }
        }
        else if (this.type == 4) {
            const boolType = this.params.boolType;
            const targetData = this.params.target;
            const toolsData = this.params.tools;

            if (boolType == '交运算') {
                this.points = [...targetData.model.points];
                this.polys = [...targetData.model.polys];

            }
            else if (boolType == '差运算') {

            }
            else if (boolType == '并运算') {

            }
        }
        const vtkPs = vtkPoints.newInstance();
        const polys = vtkCellArray.newInstance();
        const verts = vtkCellArray.newInstance();
        const lines = vtkCellArray.newInstance();
        const points = vtkCellArray.newInstance();
        for (let i = 0; i < this.points.length; i++) {
            vtkPs.insertNextPoint(this.points[i][0], this.points[i][1], this.points[i][2]);
            points.insertNextCell([i]);
        }
        for (let i = 0; i < this.polys.length; i++)
            polys.insertNextCell(this.polys[i]);
        for (let i = 0; i < this.vertices.length; i++)
            verts.insertNextCell([i]);
        for (let i = 0; i < this.lines.length; i++)
            lines.insertNextCell(this.lines[i]);

        this.data.setPoints(vtkPs);

        mode[0] ? this.data.setPolys(polys) : 0; // 网格面
        mode[1] ? this.data.setVerts(verts) : 0; // 顶点
        mode[2] ? this.data.setVerts(points) : 0; // 网格点
        mode[3] ? this.data.setLines(lines) : 0; // 边

        return this.data;
    }

    getParams() {
        return this.params;
    }

    getMatrix() {
        return this.matrix;
    }
}

// voxel modeling
class Voxel {
    constructor() {
    }
    static Precision = () => 0.05; // 1cm
}
class VoxelModel {
    constructor(type, params) {
        this.type = type;
        this.center = [0, 0, 0];
        this.resetParams(params);
    }
    resetParams(params) {
        this.voxelData = {};
        this.points = [];
        this.faces = [];
        const precision = Voxel.Precision();
        const halfPrecision = math.divide(precision, 2);
        this.precision = precision;
        this.halfPrecision = halfPrecision;
        if (this.type == 'default') {
            for (let i = 0; i < params.length; i++) {
                const pos = params[i];

                if (!(pos[0] in this.voxelData)) {
                    this.voxelData[pos[0]] = {};
                }
                if (!(pos[1] in this.voxelData[pos[0]])) {
                    this.voxelData[pos[0]][pos[1]] = {};
                }
                this.voxelData[pos[0]][pos[1]][pos[2]] = true;
            }
        }
        else if (this.type == '立方体') {
            for (let i = halfPrecision; i < params.XLen; i = math.add(i, precision)) {
                this.voxelData[i] = {};
                const iAdd = math.add(i, precision);
                const iFirst = i == halfPrecision;
                for (let j = halfPrecision; j < params.YLen; j = math.add(j, precision)) {
                    this.voxelData[i][j] = {};
                    const jAdd = math.add(j, precision);
                    const jFirst = j == halfPrecision;
                    for (let k = halfPrecision; k < params.ZLen; k = math.add(k, precision)) {
                        const out = [iFirst,//L
                            k == halfPrecision, // B
                            iAdd >= params.XLen, //R
                            math.add(k, precision) >= params.ZLen, // F
                            jAdd >= params.YLen, // U
                            jFirst]; // D
                        this.voxelData[i][j][k] = out;
                    }
                }
            }
        }
        else if (this.type == '圆锥') {
            for (let i = halfPrecision; i < params.height; i = math.add(i, precision)) {
                this.voxelData[i] = {};
                const YLimit = params.radius * (1 - i / params.height);
                const powYLimit = Math.pow(YLimit, 2);
                const iFirst = i == halfPrecision;
                const iAdd = Math.pow(params.radius * (1 - (i + precision) / params.height), 2);
                for (let j = halfPrecision; j < YLimit; j = math.add(j, precision)) {
                    this.voxelData[i][j] = {};
                    this.voxelData[i][-j] = {};
                    const powJ = j * j;
                    const ZLimit = Math.sqrt(powYLimit - powJ);
                    const jAdd = Math.pow(j + precision, 2);
                    for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
                        const out = [iFirst,//L
                            jAdd + k * k >= powYLimit, // U
                            k + precision >= ZLimit, //F
                            powJ + k * k >= iAdd] // R

                        this.voxelData[i][j][k] = [out[0], false, out[3], out[2], out[1], false];
                        this.voxelData[i][j][-k] = [out[0], out[2], out[3], false, out[1], false];
                        this.voxelData[i][-j][k] = [out[0], false, out[3], out[2], false, out[1]];
                        this.voxelData[i][-j][-k] = [out[0], out[2], out[3], false, false, out[1]];
                    }
                }
            }
        }
        else if (this.type == '圆柱体') {
            const powRadius = Math.pow(params.radius, 2);
            for (let i = halfPrecision; i < params.height; i = math.add(i, precision)) {
                this.voxelData[i] = {};
                const iFirst = i == halfPrecision;
                const iAdd = i + precision;
                for (let j = halfPrecision; j < params.radius; j = math.add(j, precision)) {
                    this.voxelData[i][j] = {};
                    this.voxelData[i][-j] = {};
                    const ZLimit = Math.sqrt(Math.pow(params.radius, 2) - j * j);
                    const JAdd = Math.pow(j + precision, 2);
                    for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
                        const out = [iFirst,//L
                            JAdd + k * k >= powRadius, // U
                            k + precision >= ZLimit, //F
                            iAdd >= params.height] // R

                        this.voxelData[i][j][k] = [out[0], false, out[3], out[2], out[1], false];
                        this.voxelData[i][j][-k] = [out[0], out[2], out[3], false, out[1], false];
                        this.voxelData[i][-j][k] = [out[0], false, out[3], out[2], false, out[1]];
                        this.voxelData[i][-j][-k] = [out[0], out[2], out[3], false, false, out[1]];
                    }
                }
            }
        }
        else if (this.type == '球体') {
            const powRadius = Math.pow(params.radius, 2);
            for (let i = halfPrecision; i < params.radius; i = math.add(i, precision)) {
                this.voxelData[i] = {};
                this.voxelData[-i] = {};
                const powI = i * i;
                const YLimit = Math.sqrt(powRadius - powI);
                const powYLimit = Math.pow(YLimit, 2);
                const IAdd = Math.pow(i + precision, 2);
                for (let j = halfPrecision; j < YLimit; j = math.add(j, precision)) {
                    this.voxelData[i][j] = {};
                    this.voxelData[i][-j] = {};
                    this.voxelData[-i][j] = {};
                    this.voxelData[-i][-j] = {};
                    const powJ = j * j;
                    const ZLimit = Math.sqrt(powRadius - powI - powJ);
                    const JAdd = Math.pow(j + precision, 2);
                    for (let k = halfPrecision; k < ZLimit; k = math.add(k, precision)) {
                        const powK = k * k;
                        const out = [JAdd + powK >= powYLimit, // U
                        k + precision >= ZLimit, //F
                        IAdd + powK + powJ >= powRadius] // R

                        this.voxelData[i][j][k] = [false, false, out[2], out[1], out[0], false];
                        this.voxelData[i][j][-k] = [false, out[1], out[2], false, out[0], false];
                        this.voxelData[i][-j][k] = [false, false, out[2], out[1], false, out[0]];
                        this.voxelData[i][-j][-k] = [false, out[1], out[2], false, false, out[0]];
                        this.voxelData[-i][j][k] = [out[2], false, false, out[1], out[0], false];
                        this.voxelData[-i][j][-k] = [out[2], out[1], false, false, out[0], false];
                        this.voxelData[-i][-j][k] = [out[2], false, false, out[1], false, out[0]];
                        this.voxelData[-i][-j][-k] = [out[2], out[1], false, false, false, out[0]];
                    }
                }
            }
        }
        else if (this.type == '布尔体') {
            const boolType = params.boolType;
            const target = params.target.voxelModel;
            const tools = [];
            for (let i = 0; i < params.tools.length; i++)
                tools.push(params.tools[i].voxelModel.voxelData);

            this.voxelData = target.voxelData;
            this.center = target.center;

            console.log([boolType, this.voxelData, tools]);

            if (boolType == '交运算') {
                // 删除与tools不相交的体素点
                for (let x in this.voxelData) {
                    const dataX = this.voxelData[x];
                    for (let y in dataX) {
                        const dataY = dataX[y];
                        for (let z in dataY) {
                            // 遍历这个点是否在所有tools中都存在
                            let flag = false;
                            for (let i = 0; i < tools.length; i++) {
                                const toolModel = params.tools[i].voxelModel;
                                const point = toolModel.ralativeVoxelPos(this, [x, y, z]);

                                if (!toolModel.hasPoint(point)) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                // del这个点
                                const point = [x, y, z];
                                delete this.voxelData[point[0]][point[1]][point[2]];
                                // 给这个点的邻接点附加边
                                point[0] = math.subtract(point[0], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][2] = true;
                                point[0] = math.add(point[0], precision);
                                point[2] = math.subtract(point[2], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][3] = true;
                                point[2] = math.add(point[2], precision);
                                point[0] = math.add(point[0], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][0] = true;
                                point[0] = math.subtract(point[0], precision);
                                point[2] = math.add(point[2], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][1] = true;
                                point[2] = math.subtract(point[2], precision);
                                point[1] = math.add(point[1], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][5] = true;
                                point[1] = math.subtract(point[1], precision);
                                point[1] = math.subtract(point[1], precision);
                                if (this.hasPoint(point))
                                    this.voxelData[point[0]][point[1]][point[2]][4] = true;
                            }
                        }
                    }
                }
            } else if (boolType == '差运算') {
                // 删除tools相交的体素点
                for (let i = 0; i < tools.length; i++) {
                    const toolVoxelData = tools[i];
                    const toolModel = params.tools[i].voxelModel;
                    // 遍历删除体素点，判断删除点是不是边界点
                    for (let x in toolVoxelData) {
                        const dataX = toolVoxelData[x];
                        for (let y in dataX) {
                            const dataY = dataX[y];
                            for (let z in dataY) {
                                const point = this.ralativeVoxelPos(toolModel, [x, y, z]);
                                if (this.hasPoint(point)) {
                                    // del这个点
                                    delete this.voxelData[point[0]][point[1]][point[2]];
                                    // 给这个点的邻接点附加边
                                    point[0] = math.subtract(point[0], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][2] = true;
                                    point[0] = math.add(point[0], precision);
                                    point[2] = math.subtract(point[2], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][3] = true;
                                    point[2] = math.add(point[2], precision);
                                    point[0] = math.add(point[0], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][0] = true;
                                    point[0] = math.subtract(point[0], precision);
                                    point[2] = math.add(point[2], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][1] = true;
                                    point[2] = math.subtract(point[2], precision);
                                    point[1] = math.add(point[1], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][5] = true;
                                    point[1] = math.subtract(point[1], precision);
                                    point[1] = math.subtract(point[1], precision);
                                    if (this.hasPoint(point))
                                        this.voxelData[point[0]][point[1]][point[2]][4] = true;
                                }
                            }
                        }
                    }
                }
            } else if (boolType == '并运算') {
                // 添加tools的体素点
                for (let i = 0; i < tools.length; i++) {
                    const toolVoxelData = tools[i];
                    const toolModel = params.tools[i].voxelModel;
                    // 遍历删除体素点，判断删除点是不是边界点
                    for (let x in toolVoxelData) {
                        const dataX = toolVoxelData[x];
                        for (let y in dataX) {
                            const dataY = dataX[y];
                            for (let z in dataY) {
                                const faces = toolVoxelData[x][y][z];
                                const point = this.ralativeVoxelPos(toolModel, [x, y, z]);

                                if (this.hasPoint(point)) {
                                    const tpoint = this.getPoint(point);
                                    for (let j = 0; j < 6; j++) {
                                        tpoint[j] &= faces[j];
                                    }
                                } else
                                    this.addPoint(point, faces);
                            }
                        }
                    }
                }
            }
        }
        this.setPointsFacesByVoxelData();
    }
    addPoints(center) {
        const halfPrecision = this.halfPrecision;
        const i = center[0];
        const j = center[1];
        const k = center[2];
        this.points.push([i - halfPrecision, j - halfPrecision, k - halfPrecision]);
        this.points.push([i + halfPrecision, j - halfPrecision, k - halfPrecision]);
        this.points.push([i + halfPrecision, j + halfPrecision, k - halfPrecision]);
        this.points.push([i - halfPrecision, j + halfPrecision, k - halfPrecision]);
        this.points.push([i - halfPrecision, j - halfPrecision, k + halfPrecision]);
        this.points.push([i + halfPrecision, j - halfPrecision, k + halfPrecision]);
        this.points.push([i + halfPrecision, j + halfPrecision, k + halfPrecision]);
        this.points.push([i - halfPrecision, j + halfPrecision, k + halfPrecision]);
    }
    addFace(direct, add) {
        switch (direct) {
            case 0:
            case 'L':
                this.faces.push([4 + add, 7 + add, 3 + add, 0 + add]);
                break;
            case 1:
            case 'B':
                this.faces.push([0 + add, 1 + add, 2 + add, 3 + add]);
                break;
            case 2:
            case 'R':
                this.faces.push([1 + add, 2 + add, 6 + add, 5 + add]);
                break;
            case 3:
            case 'F':
                this.faces.push([4 + add, 5 + add, 6 + add, 7 + add]);
                break;
            case 4:
            case 'U':
                this.faces.push([7 + add, 6 + add, 2 + add, 3 + add]);
                break;
            case 5:
            case 'D':
                this.faces.push([4 + add, 5 + add, 1 + add, 0 + add]);
                break;
            default:
                break;
        }
    }
    setPointsFacesByVoxelData() {
        for (let x in this.voxelData) {
            const dataX = this.voxelData[x];
            for (let y in dataX) {
                const dataY = dataX[y];
                for (let z in dataY) {
                    const point = [parseFloat(x), parseFloat(y), parseFloat(z)];
                    const faceStatus = dataY[z];

                    const add = this.points.length;
                    let cnt = 0;
                    for (let i = 0; i < 6; i++) {
                        // console.log(faceStatus);

                        if (faceStatus[i]) {
                            this.addFace(i, add);
                            cnt++;
                        }
                    }
                    if (cnt)
                        this.addPoints(point);
                }
            }
        }
    }
    ralativeVoxelPos(VoxelModel, pos) {
        const tmp = [...pos];
        for (let i = 0; i < 3; i++)
            tmp[i] = math.subtract(math.add(pos[i], VoxelModel.center[i]), this.center[i]);
        return tmp;
    }
    hasPoint(pos) {
        let tmp = this.voxelData;
        for (let i = 0; i < 3; i++) {
            if (!(pos[i] in tmp))
                return false;
            tmp = tmp[pos[i]];
        }
        return true;
    }
    addPoint(pos, val) {
        if (!(pos[0] in this.voxelData))
            this.voxelData[pos[0]] = {};
        if (!(pos[1] in this.voxelData[pos[0]]))
            this.voxelData[pos[0]][pos[1]] = {};
        this.voxelData[pos[0]][pos[1]][pos[2]] = val;
    }
    getPoint(pos) {
        return this.voxelData[pos[0]][pos[1]][pos[2]];
    }
}

export default Model;
