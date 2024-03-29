import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import SinglePlayer from "./components/SinglePlayer";
import Home from "./components/Home";
import Rules from "./components/Rules";
import Login from "./components/Login";
import "./App.css";
import Navbar from "./components/Navbar";
import Signup from "./components/signup";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/joinroom";
import Chat from "./components/Chat";
import DrawingPage from "./components/DrawingPage";
import DemoPage from "./components/DemoPage";
import Multiplayer from "./components/Multiplayer";
import { AppProvider } from "./AppContext";
import { SocketProvider } from "./SocketContext";
import { Toaster } from "react-hot-toast";
import LeaderBoard from "./components/LeaderBoard";

const ProtectedRoute = ({ children }) => {
  const userJSON = sessionStorage.user;
  const user = userJSON ? JSON.parse(userJSON) : null;
  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppProvider>
          <SocketProvider>
            <Navbar />
            <Routes>
              <Route element={<SinglePlayer />} path="/singleplayer" />
              <Route
                element={
                  <ProtectedRoute>
                    <Multiplayer />
                  </ProtectedRoute>
                }
                path="/multiplayer"
              />
              <Route element={<Home />} path="/" />
              <Route element={<Rules />} path="rules" />
              <Route element={<Login />} path="login" />
              <Route element={<Signup />} path="signup" />
              <Route
                element={
                  <ProtectedRoute>
                    <CreateRoom />
                  </ProtectedRoute>
                }
                path="createroom"
              />
              <Route element={<JoinRoom />} path="joinroom" />
              <Route element={<Chat />} path="chat" />
              <Route element={<DrawingPage />} path="drawingpage" />
              <Route element={<DemoPage />} path="demopage" />
              <Route element={<LeaderBoard />} path="leaderboard" />
            </Routes>
          </SocketProvider>
        </AppProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
