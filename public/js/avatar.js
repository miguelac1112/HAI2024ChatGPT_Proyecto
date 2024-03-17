const {
    Application,
    live2d: { Live2DModel },
} = PIXI;

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
// Url to Live2D
const modelUrl = "../miku/miku.model3.json";

let currentModel;

const videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector("canvas.guides");

    (async function main() {
        // create pixi application
        const app = new PIXI.Application({
            view: document.getElementById("live2d"),
            autoStart: true,
            backgroundAlpha: 0,
            resizeTo: window,
        });
    
        let backgroundImage;
    
        // Función para cargar y ajustar la imagen de fondo
        const loadBackgroundImage = async () => {
            backgroundImage = await PIXI.Sprite.from('Pueblo_japones.jpg');
            resizeBackgroundImage();
            app.stage.addChildAt(backgroundImage, 0);
        };
    
        // Función para ajustar el tamaño de la imagen de fondo
        const resizeBackgroundImage = () => {
            if (backgroundImage) {
                backgroundImage.width = app.screen.width;
                backgroundImage.height = app.screen.height;
            }
        };
    
        // Cargar la imagen de fondo y ajustarla inicialmente
        await loadBackgroundImage();
    
        // Escuchar el evento de cambio de tamaño de la ventana
        window.addEventListener('resize', resizeBackgroundImage);
    
        // load live2d model
        currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
        currentModel.scale.set(0.5);
        currentModel.interactive = true;
        currentModel.anchor.set(0.5, 0.5);
        
        // Posiciona el modelo a la izquierda y un poco más arriba
        currentModel.position.set(app.screen.width * 0.15, app.screen.height * 0.5);
    
        // Add events to drag model
        currentModel.on("pointerdown", (e) => {
            currentModel.offsetX = e.data.global.x - currentModel.position.x;
            currentModel.offsetY = e.data.global.y - currentModel.position.y;
            currentModel.dragging = true;
        });
        currentModel.on("pointerup", (e) => {
            currentModel.dragging = false;
        });
        currentModel.on("pointermove", (e) => {
            if (currentModel.dragging) {
                currentModel.position.set(e.data.global.x - currentModel.offsetX, e.data.global.y - currentModel.offsetY);
            }
        });
    
        // Add live2d model to stage
        app.stage.addChild(currentModel);
        window.currentModel = currentModel;
    })();


window.mover_boca = (x,y, lerpAmount = 0.7) => {

    const coreModel = currentModel.internalModel.coreModel;

    currentModel.internalModel.motionManager.update = (...args) => {

        let mouth_value = (coreModel.getParameterValueById("ParamMouthOpenY")-y)*0.3;
        coreModel.setParameterValueById(
            "ParamMouthOpenY",
            //lerp(y, coreModel.getParameterValueById("ParamMouthOpenY"), 0.3)
            (coreModel.getParameterValueById("ParamMouthOpenY") - y)*0.3 + y
        );
        // Adding 0.3 to ParamMouthForm to make default more of a "smile"
        // coreModel.setParameterValueById(
        //     "ParamMouthForm",
        //     0.3 + (coreModel.getParameterValueById("ParamMouthOpenY") - x)*0.3 + x
        // );
    };
};