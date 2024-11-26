import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [loggedInStatus, setLoggedInStatus] = useState("admin")

  const updateLoggedinStatus = (data)=>{
    setLoggedInStatus(data)
  }

  return (
    <AppContext.Provider value={{ loggedInStatus, updateLoggedinStatus }}>
      {children}
    </AppContext.Provider>
  );
};
