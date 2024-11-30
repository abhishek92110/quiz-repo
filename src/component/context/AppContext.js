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
  const verifyUser = async()=>{

    let response = await fetch("http://localhost:8000/verify-user", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
      },
    });

    response = await response.json()

    return response
  }

  const getAllCourse = async()=>{

    let allCourse = await fetch("http://localhost:8000/all-course", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    allCourse = await allCourse.json()

    let subCourse = [];

    allCourse.allCourse.map(data=>{
      data.subCourse.map(element=>{
        subCourse.push(element.course)
      })
    })

    return {allCourse:allCourse, subCourse:subCourse}

  }
  const getSubCourse = async()=>{

    console.log("sub course useContext=",localStorage.getItem("userCourse"))

    let subCourse = await fetch("http://localhost:8000/sub-course", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "mainCourse":localStorage.getItem("userCourse")
      },
    });

    subCourse = await subCourse.json()

    return subCourse

  }


  return (
    <AppContext.Provider value={{ loggedInStatus, updateLoggedinStatus, verifyAdmin, verifyUser, getAllCourse, getSubCourse }}>
      {children}
    </AppContext.Provider>
  );
};
