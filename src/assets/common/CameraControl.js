import EventBus from "./event-bus";

let PreCameraControl = 0;

class CameraController {
    constructor(renderer) {
        this.renderer = renderer;
        this.camera = renderer.getActiveCamera();
        this.renderWindow = renderer.getRenderWindow();
    }

    async setCamera(params) {
        // 固定视角
        if (params.Mode === 0) {
            // console.log("mode:0");
            this.camera.setPosition(params.Position[0], params.Position[1], params.Position[2]);
            this.camera.setFocalPoint(params.FocalPoint[0], params.FocalPoint[1], params.FocalPoint[2])
            this.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
            this.camera.setViewAngle(params.ViewAngle)
        } else if (params.Mode === 1) {
            // console.log("mode:1");
            this.camera.setPosition(params.Position[0], params.Position[1], params.Position[2]);
            this.camera.setFocalPoint(params.FocalPoint[0], params.FocalPoint[1], params.FocalPoint[2])
            this.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
            this.camera.setViewAngle(params.ViewAngle)
            this.renderer.resetCamera();
        }
        // 移动视角
        else if (params.Mode === 2) {
            // 延时旋转相机位置
            this.camera.setViewUp(params.ViewUp[0], params.ViewUp[1], params.ViewUp[2])
            this.camera.setViewAngle(params.ViewAngle)
            let prePoint = [...params.Position];
            if (params.Times.length == 1) {
                for (let i = 0; i < params.MidPoses.length; i++) {
                    const point = params.MidPoses[i];
                    const pNum = params.Times[0] * 100;
                    const interval = [(point[0] - prePoint[0]) / pNum, (point[1] - prePoint[1]) / pNum, (point[2] - prePoint[2]) / pNum]

                    console.log(prePoint, point, interval);
                    for (let j = 1; j <= pNum; j++) {
                        await new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                                this.camera.setPosition(prePoint[0] + interval[0] * j, prePoint[1] + interval[1] * j, prePoint[2] + interval[2] * j);
                                this.renderer.resetCamera();
                                this.renderWindow.render();
                            }, params.Times[0] * 10);
                        });
                    }

                    prePoint = [...point];
                }
            } else {

            }
        }
        this.renderWindow.render();
        PreCameraControl = 0;
    }

    on() {
        EventBus.on('camera-choose', (val) => {
            if (val)
                if (PreCameraControl == 0) {
                    // console.log("'camera-choose get:'", val);
                    PreCameraControl = 1;
                    this.setCamera(val);
                }
                else {
                    //   // 打断上一个相机控制  然后再执行新的相机控制

                }
        })
    }
}
export default CameraController;
