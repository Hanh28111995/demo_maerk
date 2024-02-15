import { useRef } from "react";

import Nav from "./components/Nav";

import WebgiViewer from "./components/WebgiViewer";
import FirstSection from "./components/FirstSection";
import SecondSection from "./components/SecondSection";
import ThirdSection from "./components/ThirdSection";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";

function App() {
  const WebgiViewerRef = useRef();
  const contentRef = useRef();

  const handlePreview = () => {
    WebgiViewerRef.current.triggerPreview();
  }

  const lenis_props = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical', // vertical, horizontal
    gestureDirection: 'vertical', // vertical, horizontal, both
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  }

  const lenis = useLenis(({ scroll }) => {
  });

  return (
    <ReactLenis root additionalProp={lenis_props}>
      <div className="App" >        
        <Nav />
        <div ref={contentRef} id="content">
          <FirstSection />
          <SecondSection />
          <ThirdSection/>
        </div>
        <WebgiViewer ref={WebgiViewerRef} contentRef={contentRef} />
      </div>
    </ReactLenis>
  );
}

export default App;
