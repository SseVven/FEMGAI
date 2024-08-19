import EventBus from './event-bus';
import vtkLight from '@kitware/vtk.js/Rendering/Core/Light';

class LightController {
    constructor(renderer) {
        this.renderer = renderer;
        this.renderWindow = renderer.getRenderWindow();
        this.MyLights = {};
    }

    logLightsInfo() {
        const data = this.renderer.getLights();
        console.log("ALL lights:(" + data.length + ")");

        for (let i = 0; i < data.length; i++) {
            const light = data[i];
            const res = {
                lightType: light.getLightType(),
                position: light.getPosition(),
                focalPoint: light.getFocalPoint(),
                direction: light.getDirection(),
                color: light.getColor(),
                intensity: light.getIntensity(),
                coneAngle: light.getConeAngle(),
                coneFalloff: light.getConeFalloff(),
                exponent: light.getExponent(),
            }
            console.log(res);
        }
    }

    /**
     * 添加 vtkLight to this.renderer
     * @param {Object} paramsOrLight vtkLightParams.
     * @param {Boolean} isVtkLightObj 
     */
    addLight(paramsOrLight, isVtkLightObj = false) {
        if (isVtkLightObj) {
            this.renderer.addLight(paramsOrLight);
            // console.log("addLight success: ", paramsOrLight);
            return;
        }
        const light = vtkLight.newInstance({
            switch: true,
            intensity: 1,
            color: paramsOrLight.color || [0, 1, 1],
        })

        this.renderer.addLight(light);
        // console.log("addLight success: ", light);
    }

    /**
     * 添加 vtkLight to this.renderer
     * @param {Object} paramsOrLight vtkLightParams.
     * @param {Boolean} isVtkLightObj 
     */
    setLight(paramsOrLight) {
        let light;
        if (paramsOrLight.key in this.MyLights) {
            light = this.MyLights[paramsOrLight.key];
        } else {
            light = vtkLight.newInstance();
            this.MyLights[paramsOrLight.key] = light;
        }

        light.setSwitch(paramsOrLight.Switch);
        light.setColor(paramsOrLight.Color);
        light.setPosition(paramsOrLight.Position[0], paramsOrLight.Position[1], paramsOrLight.Position[2]);
        light.setConeAngle(paramsOrLight.ViewAngle);

        this.renderer.addLight(light);
        this.logLightsInfo();
    }

    on() {
        EventBus.on('light-choose', (val) => {
            console.log('light-choose', val);
            this.setLight(val);
            this.renderWindow.render();
        })
    }
}
export default LightController;
