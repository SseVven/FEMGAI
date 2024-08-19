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
const saveFile = () => {
    downLoadFile("", "");
}
export default saveFile;
