import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppContext } from './context/AppContext';

const Nav = () => {
  const { loggedInStatus, updateLoggedinStatus } = useContext(AppContext);

  console.log("current location", window.location.pathname)


  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={()=>{localStorage.setItem("loggedInStatus","admin")}}>iQuiz</Link>
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
          {localStorage.getItem("loggedInStatus")=="student"?
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/quiz-result">
                  Result
                </NavLink>
              </li>
            </ul>

          {(window.location.pathname!="/register" && localStorage.getItem("loggedInStatus")=="student")  && <strong className='text-dark'>{localStorage.getItem("name")}</strong>}
            {/* <div className="navbar-text ms-auto">
              {adminDetails.name && `Admin: ${adminDetails.name}`}
              {studentDetails.name && `Student: ${studentDetails.name}`}
            </div> */}
          </div>
          :
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/quiz-result">
                  Result
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/pricing">
                  Pricing
                </NavLink>
              </li>
            </ul> */}
          
          </div>
}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
