// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function App() {
//   const navigate = useNavigate();

//   const register = ()=>{

//     navigate('/select-quiz');
//   }

//   return (
//     <div className="register-container">
//       {/* Register Form */}
//       <div className="register-form">
//         <h2>Create an Account</h2>

//         <form>
//           {/* Full Name */}
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>
//             <input type="text" id="name" placeholder="Enter your full name" name="name" />
//           </div>

//           {/* Email */}
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input type="email" id="email" placeholder="Enter your email" name="email" />
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <label htmlFor="number">Contact Number            </label>
//             <input type="number" id="number" placeholder="Enter your Number" name="number" />
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group">
//             <label htmlFor="Trainers Name">Trainers Name</label>
//             <input type="text" id="Trainers Name" placeholder="Trainers Name" name="trainer" />
//           </div>
//           {/* Batch ID */}

//           {/* Submit Button */}
//           <button type="submit" className="register-btn" onClick={register}>Register</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

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

  // Handle form submission
  const register = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Send data to the API
    try {
      const response = await fetch("https://blockey.in:8000/add-user", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to the quiz selection page on successful registration
        navigate('/select-quiz');
      } else {
        // Handle error if registration fails
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {/* Register Form */}
      <div className="register-form">
        <h2>Create an Account</h2>

        <form onSubmit={register}>
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Contact Number */}
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

          {/* Trainer's Name */}
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

          {/* Submit Button */}
          
          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
}

export default App;

