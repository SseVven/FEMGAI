import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import EventBus from './event-bus';
import Model from "./Model";
import Matrix from './Matrix';

class ModelController {
    static ModelIcon = [
        "icon-m_ac_set", "icon-yuanzhuiti", "icon-cylinder", "icon-fi-sr-sphere", "icon-bueryunsuan",
    ];
    static FileIcon = [
        "icon-wenjian", "icon-m_ac_set", "icon-bujian"
    ];
    static ModelName = [
        "立方体", "圆锥", "圆柱体", "球体", "布尔体"
    ];
    static FileName = [
        "File", "Model", "Component"
    ];
    constructor(renderer, modelData) {
        this.renderer = renderer;
        this.modelData = modelData;
        this.renderWindow = renderer.getRenderWindow();
    }

    getAUniKey() {
        return new Date().getTime().toString(36);
    }

    createModel3(type, parent = 'default', fParams = null) {
        const model = new Model(type, fParams);

        const data = model.exportPolyData(false);
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        actor.setMapper(mapper);
        mapper.setInputData(data);
        this.renderer.addActor(actor);

        const property = actor.getProperty();
        // property.setEdgeColor(0, 0, 1);
        // property.setEdgeVisibility(true)
        // property.setRepresentationToWireframe()

        // == 数据存储
        const uniqueId = this.getAUniKey()
        this.modelData[uniqueId] = {
            type: 'Model',
            key: uniqueId,
            name: ModelController.ModelName[type] + "-" + uniqueId,
            model_type: type,
            model: model,
            actor: actor,
            params: model.getParams(),
            data: data,
            // volumns: [],
            property: {
                color: property.getColor(),
                opacity: property.getOpacity(),
            },
            icon: ModelController.ModelIcon[type],
            parent: parent,
            // voxelModel: voxelModel,
        };
        if (type == 4) {
            EventBus.emit('remove-componte-query', fParams.target.key);
            for (let i = 0; i < fParams.tools.length; i++)
                EventBus.emit('remove-componte-query', fParams.tools[i].key);
        }
        // 1：添加节点 ；[x,x]添加到哪一层 ; 节点key； 名称
        this.modelData[parent].components.push(uniqueId);
        EventBus.emit("dataStructChange",
            [1, parent, uniqueId,
                this.modelData[uniqueId].name,
                'Model', this.modelData[uniqueId].icon]);

        this.renderWindow.render();
        return uniqueId;
    }

    move(actor, center) {
        actor.setPosition(center);
    }

    rotate(actor, pos, vec, deg) {
        const matrix = this.findModelDataByActor(actor).model.getMatrix();
        const afterMove = Matrix.rotateVectorAroundAxis(vec, [...matrix.center].map((v, k) => v - pos[k]), deg);
        const rotateMatrix = Matrix.getRotateMatrix(vec, deg);
        matrix.translate(matrix.center.map(v => -v));
        matrix.rotateMatrix(rotateMatrix);
        matrix.translate(pos);
        matrix.translate(afterMove);

        this.move(actor, [0, 0, 0]);
        const dd = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
        actor.rotateWXYZ(deg, vec[0] / dd, vec[1] / dd, vec[2] / dd);
        this.move(actor, matrix.center);
    }

    scale(actor, scale) {
        if (actor) {
            actor.setScaleFrom(scale);
            this.renderWindow.render();
        }
    }

    showMatrix(actor) {
        const mt = actor.getMatrix();
        console.log(mt);
        console.log(this.findModelDataByActor(actor).model.getMatrix().getMatrix4x4());
    }

    findModelDataByActor(actor) {
        for (let prop in this.modelData) {
            const data = this.modelData[prop];
            if (actor === data.actor)
                return data;
        }

        return null;
    }

    getActiveModel() {
        if (this.activeActor) {
            return this.findModelDataByActor(this.activeActor).model;
        }
        return null;
    }

    resetActor() {
        if (this.activeActor) {
            // this.activeActor.getProperty().setColor(this.activeColor);
            this.activeActor.getProperty().setRepresentationToSurface();
            this.activeActor = null;
            this.renderWindow.render();
        }
    }

    chooseActor(actor) {
        if (actor) {
            this.activeActor = actor;
            this.activeColor = this.activeActor.getProperty().getColor();
            this.activeActor.getProperty().setRepresentationToWireframe();
            // actor.getProperty().setColor(1, 0, 0);
            this.renderWindow.render();
        }
    }

    on() {
        EventBus.on('component-node-query', val => {
            const data = this.modelData[val[0]];
            // choose actor
            this.resetActor();
            this.chooseActor(data.actor);
            EventBus.emit("component-node-queryRes", data);
            EventBus.emit("pickActor", this.findModelDataByActor(this.activeActor));
        })

        EventBus.on('Property-changed', val => {
            // console.log("Property-changed", val);
            if (val[1] == 'color')
                this.modelData[val[0]].actor.getProperty().setColor(this.modelData[val[0]].property.color)
            else if (val[1] == 'opacity')
                this.modelData[val[0]].actor.getProperty().setOpacity(this.modelData[val[0]].property.opacity)
            else if (val[1] == 'center') {
                const data = this.modelData[val[0]];
                this.move(data.actor, data.model.getMatrix().center);
            }
            else if (val[1] == 'params') {
                const data = this.modelData[val[0]];
                const tdata = data.model.exportPolyData();
                data.data.setPoints(tdata.getPoints());
                data.data.setPolys(tdata.getPolys());
            }
            else if (val == 'Scale') {
                this.activeActor.setScale(this.getActiveModel().getMatrix().getScale());
                this.showMatrix(this.activeActor);
            }
            else if (val[0] == 'Rotate') {
                this.rotate(this.activeActor, [val[1][3], val[1][4], val[1][5]], [val[1][0], val[1][1], val[1][2]], val[1][6]);
            }
            // else if (val[1] == 'voxelModel') {
            //     setPolyData('体素', this.modelData[val[0]].voxelModel, this.modelData[val[0]].data);
            // } else if (val[1] == 'voxelModelparams') {
            //     this.modelData[val[0]].voxelModel.resetParams(this.modelData[val[0]].params);
            //     setPolyData('体素', this.modelData[val[0]].voxelModel, this.modelData[val[0]].data);
            // }
            this.renderWindow.render();
        })

        EventBus.on('component-add-query', val => {
            const data = this.modelData[val[0]];
            if (data == null)
                return;
            // console.log("component-add-query", val, data);

            // 添加模型 模型index == 1
            if (val[1] == 1) {
                this.createModel3(val[2], data.key);
                return;
            }
            const model = {
                key: this.getAUniKey(),
                type: val[1],
                name: ModelController.FileName[val[1]],
                params: {},
                property: {},
                components: [],
                icon: ModelController.FileIcon[val[1]],
                parent: data.key,
            };
            this.modelData[model.key] = model;

            data.components.push(model.key);
            // 1：添加节点 ；[x,x]添加到哪一层 ; 节点key； 名称
            EventBus.emit("dataStructChange",
                [1, data.key, model.key, model.name, model.type, model.icon]);
        })

        EventBus.on('component-remove-query', val => {
            const data = this.modelData[val];
            // console.log("component-remove-query", val, data, DataStruct, ModelData);
            // 找到父节点然后删掉 or 遍历移除掉 data 的components 的actor
            const myque = [data.key];
            while (myque.length > 0) {
                const node = this.modelData[myque[0]];
                myque.shift();
                if ('components' in node) {
                    for (let i = 0; i < node.components.length; i++)
                        myque.push(node.components[i]);
                } else {
                    this.renderer.removeActor(node.actor);
                }
            }
            this.renderWindow.render();
        })

        EventBus.on('createBool', val => {
            console.log(val);

            this.createModel3(4, val.target.parent, val);
        })

        EventBus.on('pick-actor', prop => {
            this.resetActor();
            this.chooseActor(prop);
        })
    }
}
export default ModelController;
