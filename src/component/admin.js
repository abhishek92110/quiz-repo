import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

function Admin() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState("");

    const navigate = useNavigate();

    return (
        <>
      <Nav/>
        <div className="home-btn-container">
            <button class="btn" onClick={()=>{navigate('/admin-question')}}>Add Question</button>
            <button class="btn" onClick={()=>{navigate('/student-answer')}}>Student Answer</button>
        </div>
        </>
    );
}

export default Admin;
