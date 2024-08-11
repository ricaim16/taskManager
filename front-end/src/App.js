import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./components/Signup";
import LoginForm from "./components/Login";
import Home from "./components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Create from "./components/Create";
import Edit from "./components/Edit";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit/>} />
      </Routes>
    </div>
  );
}

export default App;
