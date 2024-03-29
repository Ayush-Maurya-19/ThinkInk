import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {}, []);

  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const UseGameContext = () => useContext(GameContext);

export default UseGameContext;
