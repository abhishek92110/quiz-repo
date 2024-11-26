import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Nav from './Nav';

function Home() {
  const contextValue = useContext(AppContext);
  console.log("context value =",contextValue)
  const navigate = useNavigate();

  localStorage.setItem("loggedInStatus","admin")


  return (
    <div className="home-container">
      <Nav />
      <div className="home-btn-container">
        <button onClick={()=>{localStorage.setItem("loggedInStatus","admin");navigate("/admin")}}>Admin</button>
        <button onClick={()=>{localStorage.setItem("loggedInStatus","student");navigate("/register")}}>Student</button>
      </div>
    </div>
  );
}

export default Home;
