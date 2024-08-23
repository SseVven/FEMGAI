import vtkSTLWriter from "@kitware/vtk.js/IO/Geometry/STLWriter";
import vtkPLYWriter from "@kitware/vtk.js/IO/Geometry/PLYWriter";
import vtkTriangleFilter from "@kitware/vtk.js/Filters/General/TriangleFilter";

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
}
const saveFile = (modelController, type = 'PLY') => {
    if (type == 'STL') {
        const actActor = modelController.activeActor;
        if (actActor) {
            const outData = [{}];
            const data = modelController.findModelDataByActor(actActor);
            vtkTriangleFilter.newInstance().requestData([modelController.getActiveModel().exportPolyData()], outData);
            const resAscii = vtkSTLWriter.writeSTL(outData[0], 'ascii', actActor.getMatrix());
            const resBinary = vtkSTLWriter.writeSTL(outData[0], 'binary', actActor.getMatrix());
            downLoadFile(resAscii, data.name + '_ascii.stl');
            downLoadFile(resBinary, data.name + '_binary.stl');
        }
    }
    else if(type == 'PLY'){
        const actActor = modelController.activeActor;
        if (actActor) {
            const outData = modelController.getActiveModel().exportPolyData(false);
            const resAscii = vtkPLYWriter.writePLY(outData, 'ascii');
            const resBinary = vtkPLYWriter.writePLY(outData, 'binary');
            downLoadFile(resAscii, data.name + '_ascii.ply');
            downLoadFile(resBinary, data.name + '_binary.ply');
        }
    }
    else
        downLoadFile("", "");
}
export default saveFile;
