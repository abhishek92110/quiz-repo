
import React, { useState } from 'react';
import Nav from './Nav';
import AlertMessage from './AlertMessage';
import Swal from 'sweetalert2';

function AdminQuestion() 
{
    const [questionType, setQuestionType] = useState('objective'); // New state for question type
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState("");
    const [loadingStatus, setLoadingStatus]  = useState(false)

    const handleOptionChange = (e) => {
        setOptions({ ...options, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            type: questionType, // Include the type in the data
            question,
            category
        };

        if (questionType === 'objective') 
            {
            data.option1 = options.A;
            data.option2 = options.B;
            data.option3 = options.C;
            data.option4 = options.D;
            data.answer = answer;
        }

        try {
            const response = await fetch('http://localhost:8000/add-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Question added successfully:", result);

                
                showAlert("Question has beed added","success")              

                // Reset form fields
                setQuestion('');
                setOptions({ A: '', B: '', C: '', D: '' });
                setAnswer('');
                setCategory('');
                setQuestionType('objective');
            } else {
                console.error("Failed to add question:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting question:", error);
        }
    };

    const showAlert = (message, type) => {
        console.log("alert is calling")
        Swal.fire({
          title: type === 'success' ? 'Success!' : 'Error!',
          text: message,
          icon: type, // 'success', 'error', 'warning', 'info', 'question'
          confirmButtonText: 'OK',
        });
      };

    return (
        <>
            <Nav/>
            <div className="admin-form">
                <h3>Add a New Question</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Question Type:</label>
                        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} required>
                            <option value="objective">Objective</option>
                            <option value="subjective">Subjective</option>
                        </select>
                    </div>
                    <div>
                        <label>Question:</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>
                    {questionType === 'objective' && (
                        <>
                            <div>
                                <label>Option A:</label>
                                <input
                                    type="text"
                                    name="A"
                                    value={options.A}
                                    onChange={handleOptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Option B:</label>
                                <input
                                    type="text"
                                    name="B"
                                    value={options.B}
                                    onChange={handleOptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Option C:</label>
                                <input
                                    type="text"
                                    name="C"
                                    value={options.C}
                                    onChange={handleOptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Option D:</label>
                                <input
                                    type="text"
                                    name="D"
                                    value={options.D}
                                    onChange={handleOptionChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Answer:</label>
                                <select onChange={(e) => setAnswer(options[e.target.value])} required>
                                    <option value="">Select the correct answer</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <label>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select the category</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="javascript">Javascript</option>
                            <option value="software-testing">Software Testing</option>
                        </select>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default AdminQuestion;

