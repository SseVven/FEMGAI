import vtkSTLWriter from "@kitware/vtk.js/IO/Geometry/STLWriter";
import vtkPLYWriter from "@kitware/vtk.js/IO/Geometry/PLYWriter";
import vtkTriangleFilter from "@kitware/vtk.js/Filters/General/TriangleFilter";
import vtkSTLReader from '@kitware/vtk.js/IO/Geometry/STLReader';
import vtkPLYReader from '@kitware/vtk.js/IO/Geometry/PLYReader';
import EventBus from "./event-bus";
import { message } from "ant-design-vue";

const JsonToString = obj => JSON.stringify(obj);
const StringToJSON = str => {
    return JSON.parse(str);
}

const downLoadFile = (file, name) => {
    let url = window.URL.createObjectURL(new Blob([file]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 下载完成移除元素
    window.URL.revokeObjectURL(url); // 释放掉blob对象

    message.success('导出 ' + name + ' 成功');
}
const saveFile = (modelController, type = 'PLY') => {
    const actActor = modelController.activeActor;
    if (!actActor) {
        message.error('请选中导出元素再导出');
        return;
    }
    const data = modelController.findModelDataByActor(actActor);
    if (type == 'STL') {
        const outData = [{}];
        vtkTriangleFilter.newInstance().requestData([modelController.getActiveModel().exportPolyData(false)], outData);
        // const resAscii = vtkSTLWriter.writeSTL(outData[0], 'ascii', actActor.getMatrix());
        const resBinary = vtkSTLWriter.writeSTL(outData[0], 'binary', actActor.getMatrix());
        // downLoadFile(resAscii, data.name + '_ascii.stl');
        downLoadFile(resBinary, data.name + '_binary.stl');
    }
    else if (type == 'PLY') {
        const outData = modelController.getActiveModel().exportPolyData(false);
        const resBinary = vtkPLYWriter.writePLY(outData, 'binary');
        downLoadFile(resBinary, data.name + '_binary.ply');
    }
    else
        downLoadFile("", "");
}

const readFile = (file, parent) => {
    const filename = file.name;
    const type = filename.slice(filename.lastIndexOf('.') + 1, filename.length);

    if (type == 'stl') {
        const reader = vtkSTLReader.newInstance();
        const fileReader = new FileReader();
        fileReader.onload = function onLoad(e) {
            reader.parseAsArrayBuffer(fileReader.result);
            EventBus.emit('stl-reader', [reader.getOutputData(), parent]);
        };
        fileReader.readAsArrayBuffer(file);
    } else if (type == 'obj') {

    } else if (type == 'ply') {
        const reader = vtkPLYReader.newInstance();
        const fileReader = new FileReader();
        fileReader.onload = function onLoad(e) {
            reader.parseAsArrayBuffer(fileReader.result);
            EventBus.emit('stl-reader', [reader.getOutputData(), parent]);
        };
        fileReader.readAsArrayBuffer(file);
    }
}
const FIlETYPES = ['STL', 'PLY']
export { saveFile, readFile, FIlETYPES };
