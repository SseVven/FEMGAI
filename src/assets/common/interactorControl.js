import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';
import vtkOpenGLHardwareSelector from "@kitware/vtk.js/Rendering/OpenGL/HardwareSelector";
import {
    FieldDataTypes,
    FieldAssociations,
} from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';
import EventBus from './event-bus';

class InteractorController {
    constructor(fullScreenRenderer, container) {
        this.container = container;
        this.renderer = fullScreenRenderer.getRenderer();
        this.renderWindow = fullScreenRenderer.getRenderWindow();
        this.openGLRenderWindow = fullScreenRenderer.getApiSpecificRenderWindow();
        this.interactor = fullScreenRenderer.getInteractor();
        this.selector = vtkOpenGLHardwareSelector.newInstance({
            captureZValues: true,
        });
        this.selector.setFieldAssociation(FieldAssociations.FIELD_ASSOCIATION_POINTS);
        this.selector.attach(this.openGLRenderWindow, this.renderer);
        this.pickerMode = 0; // 默认prop拾取

        this.initAxes();
        this.onMouseMove();
        this.onLeftButtonPress();
    }

    initAxes() {
        this.axesActor = vtkAxesActor.newInstance({
            config: {
                recenter: false,
                tipLength: 0.2,
                tipRadius: 0.1,
                shaftRadius: 0.03
            },
            yConfig: {
                color: [0, 255, 0],
            },
            zConfig: {
                color: [0, 0, 255]
            }
        });
        this.orientationMarkerWidget = vtkOrientationMarkerWidget.newInstance();
        this.orientationMarkerWidget.setParentRenderer(this.renderer);
        this.orientationMarkerWidget.setInteractor(this.interactor);
        this.orientationMarkerWidget.setActor(this.axesActor);
    }
    showAxes(isShow) {
        this.orientationMarkerWidget.setEnabled(isShow);
    }

    onMouseMove() {
        this.interactor.onMouseMove((e) => {
            // const sc = e.position;
            // const e1 = this.handlePicking(sc.x, sc.y, 10);


            // if (e1.length === 0) {
            //     console.warn('e1 null', e1);
            //     return;
            // }
            // this.renderWindow.render();
            // EventBus.emit('mosemovde-info', e1[0]);
        });
    }

    onLeftButtonPress() {
        this.interactor.onLeftButtonPress((e) => {
            const sc = e.position;
            const e1 = this.handlePicking(sc.x, sc.y, 10);
            if (e1.length === 0) {
                EventBus.emit('pick-actor', null);
                return;
            }
            this.renderWindow.render();
            EventBus.emit('mosemovde-info', e1[0]); // footer

            if (this.pickerMode == 0)
                EventBus.emit('pick-actor', e1[0].prop);
        })
    }

    handlePicking(xp, yp, tolerance) {
        const x1 = Math.floor(xp - tolerance);
        const y1 = Math.floor(yp - tolerance);
        const x2 = Math.ceil(xp + tolerance);
        const y2 = Math.ceil(yp + tolerance);

        this.selector.setArea(x1, y1, x2, y2);

        if (this.selector.captureBuffers()) {
            const pos = [xp, yp];
            const outSelectedPosition = [0, 0];
            const info = this.selector.getPixelInformation(
                pos,
                tolerance,
                outSelectedPosition
            );

            if (info == null || info.prop == null) return [];

            const startPoint = this.openGLRenderWindow.displayToWorld(
                Math.round((x1 + x2) / 2),
                Math.round((y1 + y2) / 2),
                0,
                this.renderer
            );

            const endPoint = this.openGLRenderWindow.displayToWorld(
                Math.round((x1 + x2) / 2),
                Math.round((y1 + y2) / 2),
                1,
                this.renderer
            );

            const ray = [Array.from(startPoint), Array.from(endPoint)];

            const worldPosition = Array.from(
                this.openGLRenderWindow.displayToWorld(
                    info.displayPosition[0],
                    info.displayPosition[1],
                    info.zValue,
                    this.renderer
                )
            );

            const displayPosition = [
                info.displayPosition[0],
                info.displayPosition[1],
                info.zValue,
            ];

            const selection = [];
            selection[0] = {
                worldPosition,
                prop: info.prop,
                displayPosition,
                compositeID: info.compositeID,
                ...info.prop.get('representationId'),
                ray,
            };

            return selection;
        }
        return [];
    }

    on() {
        EventBus.on('tools-trigger', id => {
            if (id < 4) {
                this.pickerMode = id;
            }
        })
    }
}
export default InteractorController;
