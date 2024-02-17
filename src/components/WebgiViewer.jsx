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
    MeshStandardMaterial,
    Color,
    rotateDuplicatedMesh
} from "webgi";
import { scrollAnimation } from '../lib/scroll-animation';
import img from '../assets/images/preview.jpg'
import icon from '../assets/images/play-button.png'
// import vs from '../glsl/border_vs.glsl'
// import fs from '../glsl/border_fs.glsl'




const WebgiViewer = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);

    const [viewerRef, setViewerRef] = useState(null);
    const [positionRef, setPositionRef] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [isMobile, setIsMobile] = useState(null)

    useImperativeHandle(ref, () => ({
    }));

    const memorizedScrollAnimation = useCallback((position_obj1, target_obj1, position_obj2, target_obj2, position_obj3, target_obj3, isMobile, onUpdate) => {
        if (position_obj1 && target_obj1 && onUpdate) {
            scrollAnimation(position_obj1, target_obj1, position_obj2, target_obj2, position_obj3, target_obj3, isMobile, onUpdate)
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

        const Cylinder_R = 5;
        const Cylinder_H = 15;
        const Cylinder_Seg = 8;
        const SegRadius = (360 / 8) * (Math.PI / 180);

        //Create 3D zone, which wrap new slides
        const SlideCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const wrapper_slide = new Object3D;
        const geometry1 = new CylinderGeometry(Cylinder_R, Cylinder_R, Cylinder_H, Cylinder_Seg);
        const material = new MeshBasicMaterial({ color: 0x00ff00, roughness: 0.7, metalness: 0.5, transparent: true, alphaTest: 0.5, opacity: 0 }); // Adjust material properties as needed;
        const hexagon = new Mesh(geometry1, material);
        hexagon.position.set(0, 0, 0)
        hexagon.rotation.set(0, 1.55, 0)
        hexagon.castShadow = false
        const wireframeGeometry = new WireframeGeometry(geometry1);
        const wireframeMaterial = new LineBasicMaterial({ color: 0x000000 });
        const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial);
        wireframe.position.set(0, 0, 0)
        wireframe.rotation.set(0, 1.55, 0)
        wrapper_slide.add(hexagon)
        wrapper_slide.add(wireframe)

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(img);


        //Create 3D zone, which wrap new object
        const geometry2 = new PlaneGeometry(1, 1.5);
        const planeMaterial = new MeshBasicMaterial({ map: texture, });

        const planeMesh = new Mesh(geometry2, planeMaterial);
        const planeMesh1 = new Mesh(geometry2, planeMaterial);
        const planeMesh2 = new Mesh(geometry2, planeMaterial);
        const planeMesh3 = new Mesh(geometry2, planeMaterial);



        planeMesh.position.set(Cylinder_R * Math.cos(0), -2.5, Cylinder_R * Math.sin(0))
        planeMesh.rotateY(45 * 2 * Math.PI / 180)
        planeMesh.rotateX((-6) * Math.PI / 180)
        planeMesh.castShadow = false

        planeMesh1.position.set(Cylinder_R * Math.cos(SegRadius), -1, Cylinder_R * Math.sin(SegRadius))
        planeMesh1.rotateY(45 * 1 * Math.PI / 180)
        planeMesh1.rotateX((-6) * Math.PI / 180)

        planeMesh2.position.set(Cylinder_R * Math.cos(SegRadius * 2), 0.5, Cylinder_R * Math.sin(SegRadius * 2))
        planeMesh2.rotateY((0) * Math.PI / 180)
        planeMesh2.rotateX((-6) * Math.PI / 180)

        planeMesh3.position.set(Cylinder_R * Math.cos(SegRadius * 3), 2, Cylinder_R * Math.sin(SegRadius * 3))
        planeMesh3.rotateY((-45 * 1) * Math.PI / 180)
        planeMesh3.rotateX((-6) * Math.PI / 180)

        wrapper_slide.add(planeMesh)
        wrapper_slide.add(planeMesh1)
        wrapper_slide.add(planeMesh2)
        wrapper_slide.add(planeMesh3)
        wrapper_slide.position.y = (-1);
        wrapper_slide.rotateY(SegRadius * 2);
        SlideCamera.lookAt(wrapper_slide)


        //Create 3D zone, which wrap new object
        const ObjectCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const wrapper = new Object3D;
        const loader = new GLTFLoader2()
        loader.load('', (gltf) => {
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
        const position_obj3 = SlideCamera.position;
        const target_obj3 = wrapper_slide.position;

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
            wrapper_slide.rotateY(-angle / 3.2);
        }

        viewer.addEventListener("preFrame", () => {
            if (needUpdate) {
                camera.positionTargetUpdated(true);
                needUpdate = false;
            }
        })
        memorizedScrollAnimation(position_obj1, target_obj1, position_obj2, target_obj2, position_obj3, target_obj3, isMobile, onUpdate)
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


