import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Nav from './Nav';

function Admin() {
    const contextValue = useContext(AppContext);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{


      verifyAdmin()

    },[])

    const verifyAdmin = async()=>{
        const response = await contextValue.verifyAdmin()

        if(!(response.status)){
            navigate('/admin-login')
        }
    }

    return (
        <>
      <Nav/>
        <div className="home-btn-container">
            <button class="btn" onClick={()=>{navigate('/admin-question')}}>Add Question</button>
            <button class="btn" onClick={()=>{navigate('/student-answer')}}>Student Answer</button>
            <button class="btn" onClick={()=>{navigate('/exam-details')}}>Exam</button>
        </div>
        </>
    );
}

export default Admin;
