import './App.css';
import Quiz from'./component/Quiz';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Result from'./component/Result';
import Register from'./component/Register';
import Select from'./component/Select';
import QuizSelect from'./component/QuizSelect';
import NewQuiz from'./component/NewQuiz';
import AdminQuestion from './component/AdminQuestion';
import Home from './component/Home';
import Admin from './component/admin';
import UserAnswered from './component/UserAnswered';
import UpdateMarks from './component/UpdateMarks';
import { AppProvider } from './component/context/AppContext';
import AdminQuestion2 from './component/AdminQuestion2';
import Adminlogin from './component/Adminlogin';
import StudentResult from './component/StudentResult';

function App() {
  return (
    <>
{/* <Quiz/> */}
{/* <Result/> */}
{/* <Register/> */}
{/* <Select/> */}
<AppProvider>
<BrowserRouter>
<Routes>
 <Route path="/register" element={<Register/>}/>
 <Route path="/" element={<Home/>}/>
 <Route path="/update-marks" element={<UpdateMarks/>}/>
 <Route path="/student-answer" element={<UserAnswered/>}/>
 <Route path="/student-result" element={<StudentResult/>}/>
 <Route path="/admin" element={<Admin/>}/>
 {/* <Route path="/select-quiz" element={<Select /> }/> */}
 <Route path="/select-quiz" element={<QuizSelect /> }/>
 <Route path="/quiz" element={<Quiz /> }/>
 <Route path="/new-quiz" element={<NewQuiz /> }/>
 <Route path="/quiz-result" element={<Result /> }/>
 <Route path="/admin-login" element={<Adminlogin /> }/>
 {/* <Route path="/admin-question2" element={<AdminQuestion /> }/> */}
 <Route path="/admin-question" element={<AdminQuestion2 /> }/>
    </Routes>
  
  </BrowserRouter>
  </AppProvider>
    </>
  );
}

export default App;
