import React, { useState, useEffect, useContext } from 'react';
import Nav from './Nav';
import { AppContext } from './context/AppContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminQuestion2() {
    const contextValue = useContext(AppContext);
    const [questionType, setQuestionType] = useState('objective');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [file, setFile] = useState(null);
    const [allCategory, setAllCategory] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getAllCategory();

        verifyAmin()
    }, []);

    const verifyAmin = async()=>{
        const response = await contextValue.verifyAdmin()

        if(!(response.status)){
           navigate('/admin-login') 
        }
    }

    const getAllCategory = async () => {
        let response = await fetch("http://localhost:8000/all-category", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        response = await response.json();
        console.log("response all category =", response);

        setAllCategory(response.allCategory);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            Swal.fire("Error", "Please select a file to upload.", "error");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload-questions', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire("Success", "Bulk upload successful!", "success");
                setFile(null); // Reset file input
            } else {
                Swal.fire("Error", "Failed to upload questions.", "error");
            }
        } catch (error) {
            console.error("Error uploading questions:", error);
            Swal.fire("Error", "Something went wrong during the upload.", "error");
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        if (isAddingNewCategory && !newCategory.trim()) {
            Swal.fire("Error", "Please enter a category name.", "error");
            return;
        }

        const newQuestion = {
            type: questionType,
            question,
            category: isAddingNewCategory ? newCategory : category,
            option1:options.A,
            option2:options.B,
            option3:options.C,
            option4:options.D,
            answer,
        };

        try {
            // If a new category is being added, save it to the backend first.
           
            // Add the question
            const response = await fetch('http://localhost:8000/add-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

            if (response.ok) {
                Swal.fire("Success", "Question added successfully!", "success");
                setQuestion('');
                setOptions({ A: '', B: '', C: '', D: '' });
                setAnswer('');
                setCategory('');
            } else {
                Swal.fire("Error", "Failed to add question.", "error");
            }
        } catch (error) {
            console.error("Error adding question:", error);
            Swal.fire("Error", "Something went wrong while adding the question.", "error");
        }
    };

    return (
        <>
            <Nav />
            <div className="admin-form">
                <h3>Add a New Question</h3>
                <form onSubmit={handleAddQuestion}>
                    <div>
                        <label>Question Type:</label>
                        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                            <option value="objective">Objective</option>
                            <option value="subjective">Subjective</option>
                        </select>
                    </div>
                    <div className='add-question-section'>
                        <label>Question:</label>
                        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
                    </div>
                    {questionType === 'objective' && (
                        <>
                            <div>
                                <label>Option A:</label>
                                <input
                                    type="text"
                                    value={options.A}
                                    onChange={(e) => setOptions({ ...options, A: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Option B:</label>
                                <input
                                    type="text"
                                    value={options.B}
                                    onChange={(e) => setOptions({ ...options, B: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Option C:</label>
                                <input
                                    type="text"
                                    value={options.C}
                                    onChange={(e) => setOptions({ ...options, C: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Option D:</label>
                                <input
                                    type="text"
                                    value={options.D}
                                    onChange={(e) => setOptions({ ...options, D: e.target.value })}
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
                        {isAddingNewCategory ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter new category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNewCategory(false)}
                                >
                                    Select Existing
                                </button>
                            </div>
                        ) : (
                            <div>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Select the category</option>
                                    {allCategory.map((data, index) => (
                                        <option key={index} value={data.category}>{data.category}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNewCategory(true)}
                                >
                                    Add New Category
                                </button>
                            </div>
                        )}
                    </div>
                    <button type="submit">Add Question</button>
                </form>

                <h3 className='my-4'>Bulk Upload Questions</h3>
                <form onSubmit={handleBulkUpload}>
                    <div>
                        <label>Upload Excel/CSV File:</label>
                        <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
                    </div>
                    <button type="submit">Upload Questions</button>
                </form>
            </div>
        </>
    );
}

export default AdminQuestion2;
