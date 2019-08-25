import React, { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const iframe = useRef();
  const handleLoad = function() {
    document.domain = "localhost";

    iframe.current.contentWindow.document.querySelector("button");
  };

  return (
    <div className="App">
      <iframe
        ref={iframe}
        onLoad={handleLoad}
        src="http://localhost:3000/"
        title="Source"
      />
    </div>
  );
}

export default App;
