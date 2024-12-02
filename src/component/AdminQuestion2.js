import React, { useState, useEffect, useContext } from 'react';
import Nav from './Nav';
import { AppContext } from './context/AppContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from './Loading';

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
    const [subCourse, setSubCourse] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [questionStatus, setQuestionStatus] = useState("single")
    const [date, setDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        getSubCourse();

        verifyAmin()
    }, []);

    const verifyAmin = async()=>{
        const response = await contextValue.verifyAdmin()

        if(!(response.status)){
           navigate('/admin-login') 
        }
    }

    const getSubCourse = async () => {
       

        let data = await contextValue.getAllCourse()

        console.log("sub course =",data.subCourse)

        setSubCourse(data.subCourse)


    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();

        setLoadingStatus(true)
        if (!file) {
            Swal.fire("Error", "Please select a file to upload.", "error");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        console.log("upload question route =",date)

        try {
            let response = await fetch('http://localhost:8000/upload-questions', {
                method: 'POST',
                headers:{

                    examDate:date,
                    course:category,
                },

                body: formData,
            });

             response = await response.json();

            if (response.status) {
                setLoadingStatus(false)
                Swal.fire("Success", "Bulk upload successful!", "success");
                setFile(null); // Reset file input
            } 
            else {
                Swal.fire("Error", "Failed to upload questions.", "error");
            }
        } 
        catch (error) {
            console.error("Error uploading questions:", error);
            Swal.fire("Error", "Something went wrong during the upload.", "error");
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        setLoadingStatus(true)

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
            date:date,
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
                setLoadingStatus(false)
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
            {loadingStatus && <Loading/>}
            <div className="admin-form">
                <button onClick={()=>setQuestionStatus("single")}>Single</button>
                <button onClick={()=>setQuestionStatus("bulk")} className='mx-4'>Bulk</button>
                {
                    questionStatus=="single" ?
                    <>
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
                                    <option disabled selected>Select the correct answer</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div>
                        <label>Course:</label>
                       
                            <div>
                                <select onChange={(e) => setCategory(e.target.value)} required>
                                    <option selected disabled>Select Course</option>
                                    {subCourse.map((data, index) => (
                                        <option key={index} value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
    <label>Date:</label>
    <input
        type="date"
        value={date}
        onChange={(e) => {setDate(e.target.value);console.log("set date =",e.target.value)}}
        required
    />
</div>
                        
                    </div>
                    <button type="submit">Add Question</button>
                </form>
                </>
                    :
                <>
                <h3 className='my-4'>Bulk Upload Questions</h3>
                <form onSubmit={handleBulkUpload}>
                <div>
                        <label>Course:</label>
                       
                            <div>
                                <select onChange={(e) => setCategory(e.target.value)} required>
                                    <option selected disabled>Select Course</option>
                                    {subCourse.map((data, index) => (
                                        <option key={index} value={data}>{data}</option>
                                    ))}
                                </select>
                            </div>
                        
                    </div>

                    <div>
    <label>Date:</label>
    <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
    />
</div>
                    <div>

                        <label>Upload Excel/CSV File:</label>
                        <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
                    </div>
                    <button type="submit">Upload Questions</button>
                </form>
                </>
}
            </div>
        </>
    );
}

export default AdminQuestion2;
