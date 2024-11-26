import React, { useState } from 'react';
import Nav from './Nav';
import Swal from 'sweetalert2';

function AdminQuestion2() {
    const [questionType, setQuestionType] = useState('objective');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);

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

        const newQuestion = {
            type: questionType,
            question,
            category,
            options,
            answer,
        };

        try {
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
                    <div>
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
                                <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                            </div>
                        </>
                    )}
                    <div>
                        <label>Category:</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <button type="submit">Add Question</button>
                </form>

                <h3>Bulk Upload Questions</h3>
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
