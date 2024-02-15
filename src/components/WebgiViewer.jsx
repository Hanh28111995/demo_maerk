import React, {
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useEffect
} from 'react'
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    mobileAndTabletCheck,
    Vector3,
    Object3D,
    GLTFLoader2,
    PerspectiveCamera,
    CircleGeometry,
    MeshBasicMaterial,
    DoubleSide,
    Mesh,
    MeshPhongMaterial,
    LineSegments,
    EdgesGeometry,
    LineBasicMaterial,
    WireframeGeometry,
    CylinderGeometry,
    TextureLoader,
    PlaneGeometry,
    Group,
    ShaderMaterial,
    MeshStandardMaterial
} from "webgi";
import { scrollAnimation } from '../lib/scroll-animation';
import img from '../assets/images/preview.jpg'
import icon from '../assets/images/play-button.png'




const WebgiViewer = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);

    const [viewerRef, setViewerRef] = useState(null);
    const [positionRef, setPositionRef] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [isMobile, setIsMobile] = useState(null)

    useImperativeHandle(ref, () => ({
    }));

    const memorizedScrollAnimation = useCallback((position_obj1, target_obj1, position_obj2, target_obj2, isMobile, onUpdate) => {
        if (position_obj1 && target_obj1 && onUpdate) {
            scrollAnimation(position_obj1, target_obj1, position_obj2, target_obj2, isMobile, onUpdate)
        }
    }, [])

    const setupViewer = useCallback(async () => {
        //init main viewr (scence + camera) 
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        })

        setViewerRef(viewer)

        //check responsive
        const isMobileOrTablet = mobileAndTabletCheck();
        setIsMobile(isMobileOrTablet)

        //add plugin support adding glb to viewer
        // const obj1 = await viewer.addPlugin(new AssetManagerPlugin)

        // //Create 3D zone, which wrap new slides
        // const SlideCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // const wrapper_slide = new Object3D;
        // const geometry = new CylinderGeometry(2, 2, 3, 8);
        // const texttureLoader = new TextureLoader();
        // const material = new MeshBasicMaterial({ color: 0x00ff00, roughness: 0.7, metalness: 0.5 }); // Adjust material properties as needed;
        // const hexagon = new Mesh(geometry, material);
        // hexagon.position.set(0, 0, 0)
        // hexagon.rotation.set(0, 2.55, 0)
        // const wireframeGeometry = new WireframeGeometry(geometry);
        // const wireframeMaterial = new LineBasicMaterial({ color: 0x000000 });
        // const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial);
        // wireframe.position.set(0, 0, 0)
        // wireframe.rotation.set(0, 2.55, 0)
        // wrapper_slide.add(hexagon)
        // wrapper_slide.add(wireframe)


        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(img);

        const paddingX = 0.1; // Adjust the padding on the X-axis
        const paddingY = 0.1; // Adjust the padding on the Y-axis

        
        //Create 3D zone, which wrap new object

        const wrapper_slide = new Object3D;
        const geometry = new PlaneGeometry(2, 3);
        const planeMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        const planeMesh = new Mesh(geometry, planeMaterial)
        wrapper_slide.add(planeMesh)






        //Create 3D zone, which wrap new object
        const ObjectCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const wrapper = new Object3D;
        const loader = new GLTFLoader2()
        loader.load('./podium3.glb', (gltf) => {
            const loadedObject = gltf.scene;
            loadedObject.scale.set(0.8, 0.8, 0.8);
            loadedObject.rotateY((180 + 35) * (Math.PI / 180))
            loadedObject.position.set(0, -1.5, 0)
            ObjectCamera.lookAt(loadedObject.position)
            wrapper.add(loadedObject);
            wrapper.position.set(0, -5, 0);
        });

        const camera = viewer.scene.activeCamera;
        const position_obj1 = camera.position;
        const target_obj1 = camera.target;
        const position_obj2 = ObjectCamera.position;
        const target_obj2 = wrapper.position;

        setCameraRef(camera)
        setPositionRef(ObjectCamera)

        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)

        //add object wrapper , direct child of viewer
        viewer.scene.add(wrapper)
        viewer.scene.add(wrapper_slide)


        viewer.renderer.refreshPipeline()

        //add object glb, direct child of viewer
        // await obj1.addFromPath("./scene.glb")


        const firstModel = viewer.scene.children[0];
        firstModel.scale.set(1.15, 1.15, 1.15);
        firstModel.position.set(-0.03, 0, 0);
        firstModel.rotateY(100 * (Math.PI / 180));

        //after add all file , clip background
        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        window.scrollTo(0, 0)
        let cameraPosition = new Vector3(5.79, 3.61, 8.40);
        viewer.scene.activeCamera.position = cameraPosition
        viewer.scene.activeCamera.target = new Vector3(0, 0, 0);
        let needUpdate = true;

        let angle = 0;
        let max_distance = 400;

        const onUpdate = (direction, lastPostion, presentPositon) => {
            let delta = (presentPositon - lastPostion) * (max_distance / 1800);
            needUpdate = true;
            if (direction) angle = delta * (Math.PI / 180);
            else angle = (-delta) * (Math.PI / 180);
            firstModel.rotateY(angle);
        }

        viewer.addEventListener("preFrame", () => {
            if (needUpdate) {
                camera.positionTargetUpdated(true);
                needUpdate = false;
            }
        })
        memorizedScrollAnimation(position_obj1, target_obj1, position_obj2, target_obj2, isMobile, onUpdate)
    }, []);

    useEffect(() => {
        setupViewer();
    }, [])

    return (
        <div id='webgi-canvas-container' ref={canvasContainerRef}>
            <canvas id='webgi-canvas' ref={canvasRef} />
        </div>
    )
})

export default WebgiViewer;


