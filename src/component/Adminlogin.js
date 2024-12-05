import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, signInWithCredential, getAuth } from "firebase/auth";


import googleIcon from "../image/google-icon.png";

// Firebase configuration
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import Loading from './Loading';
import { auth } from './firebase';
import Nav from './Nav';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = 
{
  apiKey: "AIzaSyByzWTpeF9pwCrAX-YKntJwq8MTTXErfnM",
  authDomain: "quiz-app-4356d.firebaseapp.com",
  projectId: "quiz-app-4356d",
  storageBucket: "quiz-app-4356d.firebasestorage.app",
  messagingSenderId: "530982372582",
  appId: "1:530982372582:web:d191aca2965b9d10e9e727",
  measurementId: "G-WNLX0T31G1"
};

function Adminlogin() {
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(false)

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    trainer: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle manual registration
  const register = async (e) => {
    setLoadingStatus(true)
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch("https://blockey.in:8000/admin-login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status) {
        setLoadingStatus(false)
        localStorage.setItem("adminToken",result.token)
        navigate('/admin');
      } else {
        alert('Credential Invalid');
        setLoadingStatus(false)
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <>

<Nav/>
{loadingStatus && <Loading/>}

    <div className={`register-container ${loadingStatus && "overlay"}`}>
      <div className="register-form bg-cover-color">
        <h2>Admin Login</h2>

        <form onSubmit={register}>
        
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn">Log In</button>
        </form>

      </div>
    </div>
    </>
  );
}

export default Adminlogin;
