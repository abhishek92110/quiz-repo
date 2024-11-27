import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [loggedInStatus, setLoggedInStatus] = useState("admin")

  const updateLoggedinStatus = (data)=>{
    setLoggedInStatus(data)
  }

  const verifyAdmin = async()=>{

    let response = await fetch("http://localhost:8000/verify-admin", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("adminToken"),
      },
    });

    response = await response.json()

    return response
  }

  return (
    <AppContext.Provider value={{ loggedInStatus, updateLoggedinStatus, verifyAdmin }}>
      {children}
    </AppContext.Provider>
  );
};
