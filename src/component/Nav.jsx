import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Loading from './Loading';
import iQuizLogo from '../image/iQuizLogo.png'

const Nav = (props) => {

  const [loadingStatus, setLoadingStatus] = useState(false)

  // console.log("current location", window.location.pathname, props)

  const navigate = useNavigate();

  const handleLogOut = ()=>{
    setLoadingStatus(true)
    localStorage.removeItem("token")
    localStorage.removeItem("category")
    localStorage.removeItem("name")
    localStorage.removeItem("userCourse")
    localStorage.removeItem("userId")

    setTimeout(()=>{

  setLoadingStatus(false)

    navigate('/register')
    },2000)

  }

  return (
    <div>
    {loadingStatus &&  <Loading/>}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to={props.status?"/register":"/"}><img className='logo-image' src={iQuizLogo}/></Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {props.status=="student" &&
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">

                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/quiz-result">
                <strong>Result</strong>
                </NavLink>
                
               
              </li>

         <li><strong className='text-dark mr-4' >{localStorage.getItem("name")}</strong></li>
        <li> <strong className='text-dark pointer' onClick={handleLogOut}>Log Out</strong></li>
        
            </ul>

           
          </div>
}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
