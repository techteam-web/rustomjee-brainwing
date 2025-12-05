import { createContext, useContext, useState } from "react";

const SceneReadyContext = createContext({
  sceneReady: false,
  setSceneReady: () => {},
});

export const SceneReadyProvider = ({ children }) => {
  const [sceneReady, setSceneReady] = useState(false);
  return (
    <SceneReadyContext.Provider value={{ sceneReady, setSceneReady }}>
      {children}
    </SceneReadyContext.Provider>
  );
};

export const useSceneReady = () => useContext(SceneReadyContext);