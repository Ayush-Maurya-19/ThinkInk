import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//create a context to store the current user
const AppContext = createContext();

//create a provider to store the current user
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("user");
    setLoggedin(false);
    navigate("/login");
  };

  const [loggedin, setLoggedin] = useState(currentUser !== null);

  return (
    <AppContext.Provider value={{ loggedin, setLoggedin, logout }}>
      {children}
    </AppContext.Provider>
  );
};

const UseAppContext = () => useContext(AppContext);

export default UseAppContext;
