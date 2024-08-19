import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import EventBus from './event-bus';
import Model from "./Model";

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

        const data = model.exportPolyData();
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        actor.setMapper(mapper);
        mapper.setInputData(data);
        this.renderer.addActor(actor);
        this.renderWindow.render();


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
            actor: actor,
            model_type: type,
            params: model.getParams(),
            data: data,
            volumns: [],
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
        return uniqueId;
    }

    findModelDataByActor(actor) {
        for (let prop in this.modelData) {
            const data = this.modelData[prop];
            if (actor === data.actor)
                return data;
        }

        return null;
    }

    on() {
        EventBus.on('component-node-query', (val) => {
            // console.log(this.modelData[val[0]]);
            EventBus.emit("component-node-queryRes", this.modelData[val[0]]);
        })

        EventBus.on('Property-changed', (val) => {
            console.log("Property-changed", val);
            if (val[1] == 'color')
                this.modelData[val[0]].actor.getProperty().setColor(this.modelData[val[0]].property.color)
            else if (val[1] == 'opacity')
                this.modelData[val[0]].actor.getProperty().setOpacity(this.modelData[val[0]].property.opacity)
            // else if (val[1] == 'params') {
            //     setPolyData(this.modelData[val[0]].model_type, this.modelData[val[0]].params, this.modelData[val[0]].data);
            // } else if (val[1] == 'voxelModel') {
            //     setPolyData('体素', this.modelData[val[0]].voxelModel, this.modelData[val[0]].data);
            // } else if (val[1] == 'voxelModelparams') {
            //     this.modelData[val[0]].voxelModel.resetParams(this.modelData[val[0]].params);
            //     setPolyData('体素', this.modelData[val[0]].voxelModel, this.modelData[val[0]].data);
            // }
            this.renderWindow.render();
        })

        EventBus.on('component-add-query', (val) => {
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

        EventBus.on('component-remove-query', (val) => {
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
            this.createModel3(4, val.target.parent, val);
        })
    }
}
export default ModelController;
