import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
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

function App() {
  const contextValue = useContext(AppContext);
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [googleStatus, setGoogleStatus] = useState(false)
  const [allCourse, setAllCourse] = useState([])

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    trainer: '',
    course:''
  });

  useEffect(()=>{

    
    verifyUser()
    getAllCourse()


  },[])

  const verifyUser = async()=>{
   
    const response = await contextValue.verifyUser()

    if((response.status)){
        navigate('/select-quiz')
    }
}

  const getAllCourse = async()=>{

    let data = await contextValue.getAllCourse()

    console.log("all Course context =",data)

    setAllCourse(data.allCourse.allCourse)
  }

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
      const response = await fetch("http://localhost:8000/add-user", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setGoogleStatus(false)

      console.log("result manual add =",result)

      localStorage.setItem("token",result.token);
      localStorage.setItem("name",result.name)
      localStorage.setItem("userCourse",result.course)

      if (response.ok) {
        setLoadingStatus(false)
        navigate('/select-quiz');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const provider  = new GoogleAuthProvider()  
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Mobile/i.test(navigator.userAgent);

  const handleGoogleLogin = async () => {
  setLoadingStatus(true);

  try {

    let result
      // Use signInWithPopup for desktops
      if(isMobile){
        console.log("mobile section")
        //  result = signInWithRedirect(auth, provider);
        result = await signInWithPopup(auth, provider);
        console.log("after pop up")
      }
      else{
        console.log("desktop section")
        result = await signInWithPopup(auth, provider);
        console.log("after pop up")
      }
      const user = result.user;

      // Prepare data to send to your backend

      setFormData({["name"]:user.displayName, ["email"]:user.email})

      const googleUserData = {
        name: user.displayName,
        email: user.email,
        number: '', // Optionally collect later
        trainer: '', // Optionally collect later
      };

      setGoogleStatus(true)

      console.log("google user data =",googleUserData)

      // Send data to your API
      // const response = await fetch("http://localhost:8000/add-user", {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(googleUserData),
      // });

      // const result2 = await response.json();
      // localStorage.setItem("token", result2.token);
      // localStorage.setItem("name", result2.name);
      

      // if (response.ok) {
      //   setLoadingStatus(false);
      //   navigate('/select-quiz');
      // }
        
      // else {
      //   alert(result2.message || 'Google Login failed');
      // }
    
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    alert('An error occurred during Google Login. Please try again.');
  } finally {
    setLoadingStatus(false);
  }
};

  return (
    <>

<Nav/>
{loadingStatus && <Loading/>}

    {!googleStatus ? 
    <div className={`register-container ${loadingStatus && "overlay"}`}>
      <div className="register-form bg-cover-color">
        <h2>Create an Account</h2>

        <form onSubmit={register}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="number">Contact Number</label>
            <input
              type="number"
              id="number"
              placeholder="Enter your Number"
              name="number"
              value={formData.number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="trainer">Trainer's Name</label>
            <input
              type="text"
              id="trainer"
              placeholder="Enter Trainer's Name"
              name="trainer"
              value={formData.trainer}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="google-login" onClick={handleGoogleLogin}>
          <p>Or</p>
          <div className='sign-in-google'>
          <button className="google-login-btn" id="signInButton" >
          <img src={googleIcon}/>
          </button>
            <span>Sign In With Google</span>
          </div>
        </div>
      </div>
    </div>
    :
    <div className={`register-container slide-in ${loadingStatus && "overlay"}`}>
    <div className="register-form bg-cover-color">
      <h2>Create an Account</h2>

      <form onSubmit={register}>

        <div className="form-group">
          <label htmlFor="course">Course</label>
          
          <select
              className="custom-select"
              name="course"
              onChange={handleChange}
              
            >
              <option selected disabled>--- Select Category ---</option>
              {allCourse.length > 0 && allCourse.map((data, index) => {
                return (
                  <option key={index} value={data.mainCourse}>{data.mainCourse}</option>
                );
              })}
            </select>
        </div>

        <div className="form-group">
          <label htmlFor="number">Contact Number</label>
          <input
            type="number"
            id="number"
            placeholder="Enter your Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="trainer">Trainer's Name</label>
          <input
            type="text"
            id="trainer"
            placeholder="Enter Trainer's Name"
            name="trainer"
            value={formData.trainer}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  </div>}
    </>
  );
}

export default App;
