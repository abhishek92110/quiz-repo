const express = require('express');
const router = express.Router();
const questiondb = require("../model/Question")
const user = require("../model/User")
const saveQuiz  = require("../model/SaveQuiz")
const jwt = require('jsonwebtoken');
const verifyUser = require("../middleware/verifyUser")
const categories = require("../model/Category")
const allCourse  = require("../model/AllCourse")
const admin = require("../model/Admin")
const multer = require('multer');
const Papa = require('papaparse'); // For CSV parsing
const xlsx = require('xlsx'); // For Excel parsing
const fs = require('fs');
const verifyAdmin = require('../middleware/verifyAdmin');
const upload = multer({ dest: 'uploads/' });

const jwt_secret = 'www'; 

router.get('/', async (req, res) => {
    res.send({ "status": "running" });
});


router.post('/upload-questions', upload.single('file'), async (req, res) => {
    const date   =  req.header("examDate")
    const course =  req.header("course")
    console.log("Bulk question upload running", course,date,req.header("examDate"));

    try {
        const filePath = req.file.path;
        let questions = [];

        // Process CSV or Excel file based on MIME type
        if (req.file.mimetype === 'text/csv') 
            {
            const csvData = fs.readFileSync(filePath, 'utf8');
            const parsedData = Papa.parse(csvData, { header: true });
            questions = parsedData.data;
        } 
        else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
            {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            questions = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } 
        else {
            return res.status(400).json({ status: false, message: 'Unsupported file format' });
        }

        fs.unlinkSync(filePath); // Delete the uploaded file after processing

        let addedCount = 0; // Track successfully added questions
        let failedCount = 0; // Track failed questions

        let previousData = await questiondb.find({category:course, date:date})
        console.log("previous data =",previousData)

        if(previousData.length>0){

            console.log("if condition")

            let oldQuestion = previousData[0].questions

            let newQuestion = [...oldQuestion, ...questions];

            console.log("length of questions =",newQuestion.length,oldQuestion.length, questions.length,course,date);

            await questiondb.updateOne({category:course, date:date},{$set:{questions:newQuestion}})

        }

        else{

            console.log("else condition")

            const newQuestion = new questiondb({
                questions:questions,
                status:"Active",
                category:course,
                date
            });

            const savedQuestion = await newQuestion.save();

        }


        res.status(201).json({
            status: true,
            message: 'Bulk upload completed',
            added: addedCount,
            failed: failedCount
        });
    } 
    catch (error) {
        console.error('Error during bulk upload:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});


router.get("/get-course-date-exam", async (req, res) => 
    {
    try {
        const course = req.header("course");
        const startDate = req.header("startDate");
        const endDate = req.header("endDate");

        console.log("course =", course, "startDate =", startDate, "endDate =", endDate);

        // Validate date inputs
        if (!startDate || !endDate) {
            return res.status(400).json({ status: false, error: "startDate and endDate are required." });
        }

        let getExam;

        if (course === "all") {
            // Fetch all exams within the date range
            getExam = await questiondb.find({
                date: { $gte: startDate, $lte: endDate }
            });
        } else {
            // Fetch exams for a specific course within the date range
            getExam = await questiondb.find({
                category: course,
                date: { $gte: startDate, $lte: endDate }
            });
        }

        res.send({ status: true, length: getExam.length, data: getExam });

    } 
    catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ status: false, error: "Server error" });
    }
});


// update exam status route 

router.put("/update-exam-status",async(req,res)=>{

    console.log("update exam route is running =",req.body)
  
    try{
    const data = req.body

    await questiondb.updateOne({_id:data._id}, {$set:data})
   
    res.send({status:true})
    }
    catch(error){
        console.log("error update exam ",error.message)
        res.send({status:false})
    }

    
    
})

// route to delete exam 

router.delete("/delete-exam",async(req,res)=>{

    console.log("delete exam route is running =",req.body)
  
    try{
    const data = req.body

    await questiondb.deleteOne({_id:data.id})
   
    res.send({status:true})
    }

    catch(error){
        console.log("error update exam ",error.message)
        res.send({status:false})
    }
 
})

router.post('/add-question', async (req, res) => {
    console.log("add question running")
    try {
        console.log("req body add-question =",req.body)
        const { question, option1, option2, option3, option4, answer, category, type,date } = req.body;

        let previousData = await questiondb.find({category:category, date:date})


        if(previousData.length>0){
            let newQuestion = previousData[0].questions
            newQuestion.push(
                {
                    question,
                    option1,
                    option2,
                    option3,
                    option4,
                    answer,
                    type
                }
            )
            await questiondb.updateOne({category:category, date:date},{$set:{questions:newQuestion}})
        }
        else{

        // Create a new question
        const newQuestion = new questiondb({
            questions:[{
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                type
            }],
            status:"Active",
            category,
            date
        });

        // Save the question to the database
        const savedQuestion = await newQuestion.save();
    }

        res.status(201).json({ "status":true,message: 'Question added successfully' });
    } 
    catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({"status":false, error: 'Server error' });
    }
});


router.get('/get-question', async (req, res) => {
    try {
       const category = req.header("category")
       const date = req.header("examDate")
       console.log("category =",category,date)

       const allQuestions  = await questiondb.find({category:category, date:date});
        res.status(201).json({ status: true, question: allQuestions });

    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({status: false, error: 'Server error' });
    }
});


router.post('/add-user', async (req, res) => {
    try {
        const data = req.body;

        console.log("data from add-user route=",data)

        // Check if a user with the same email already exists
        const existingUser = await user.findOne({ email: data.email });

        if (existingUser) 
            {
            // Generate a token with the user's ID
            const token = jwt.sign({ userId: existingUser._id, userName:data.name, userEmail:existingUser.email, course:data.course }, jwt_secret);

            await user.updateOne({email: data.email},{$set: data})

            // Email already exists, return status true and token
            return res.status(200).json({ status: true, token, name:data.name, course:data.course });
        }

        // Create a new user document
        const newUser = new user(data);

        // Save the user to the database
        const savedUser = await newUser.save();

        // Generate a token with the user's ID
        const token = jwt.sign({ userId: savedUser._id,  userName:data.name, userEmail:savedUser.email, course:data.course }, jwt_secret);

        res.status(201).json({ status: true, user: savedUser, token, name:data.name, course:data.course });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

// admin login route

router.post('/admin-login', async (req, res) => {
    try {
        const data = req.body;
        console.log("data admin login route =",data)

        // Check if a user with the same email already exists
       
        const adminData = await admin.find({email:data.email, password:data.password})

            if(adminData.length>0){

                const token = jwt.sign({ Id: adminData[0]._id, email:adminData[0].email }, jwt_secret);

                res.status(201).json({ status: true, token:token});
            }

            else{
                res.status(201).json({ status: false});
            }

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});
router.get('/verify-admin',verifyAdmin, async (req, res) => {
    try {

        // Check if a user with the same email already exists
       if(req.message){
        res.send({status:true})
       }
       else{
        res.send({status:false})
       }

    } 
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});
router.get('/verify-user',verifyUser, async (req, res) => {
    try {

        // Check if a user with the same email already exists
       if(req.message){
        res.send({status:true})
       }
       else{
        res.send({status:false})
       }

    } 
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});


router.post('/save-quiz-question', verifyUser, async (req, res) => {
    try
     {
        const data = req.body;

        // Include user ID from the middleware
        const quizData = {
            ...data,
            user: req.userId, // Add the verified user ID
            username:req.userName,
            useremail:req.userEmail,
            date:req.body.date
        };

        console.log("quiz data =",req.body,req.body.date)

        await saveQuiz.updateOne({user:req.userId, category:data.category},{$set:quizData},{upsert:true})

        res.status(201).json({ status: true });
    } 
    catch (error) {
        console.error('Error saving quiz question:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

// router to get active quiz list of date

router.get('/active-quiz',async(req,res)=>{
    const mainCourse = req.header("mainCourse")
    const date = req.header("examDate")


    const subCourse  = await allCourse.find({mainCourse:mainCourse})
    const activeQuiz = await questiondb.find({status:"Active",date:date})

    const activeSubCourse = []

    activeQuiz.map(data=>{

        subCourse[0].subCourse.map(element=>{
            if(data.category==element.course){
                activeSubCourse.push(element.course)
            }
        })

    })

    res.send({status:true,activeSubCourse:activeSubCourse})

})

router.put('/update-save-quiz-question', async (req, res) => {
    try
     {
        const data = req.body;

        await saveQuiz.updateOne({user:data.id, category:data.category},{$set:{question:data.question, status:true, marks:data.marks}},{upsert:true})

        res.status(201).json({ status: true });
    } 
    catch (error) {
        console.error('Error saving quiz question:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

// router to get saved quiz question

router.get('/get-save-quiz-question', verifyUser, async (req, res) => {
    try
     {
        const category = req.header("category")

        const date = new Date();

        const month = (date.getMonth()+1).toString().padStart(2,'0')
        let day = (date.getDay()).toString().padStart(2,'0');
        let year = date.getFullYear();

        let fullDate = `${year}-${month}-${day}`

        // Include user ID from the middleware

        const userAnswer = await saveQuiz.find({category:category,user:req.userId, date:fullDate})

        res.status(201).json({ status: true, userAnswer:userAnswer });
    } 
    catch (error) 
    {
        console.error('Error saving quiz question:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});


router.get('/get-save-quiz-question-admin', async (req, res) => 
    {
    try
     {
        const category =   req.header("category")
        const userId   =   req.header("id")
        const status   =   req.header("status")

        // Include user ID from the middleware

        console.log("user id and category =",category, userId)

        let userAnswer = await saveQuiz.find({category:category,user:userId})
          
        // console.log("useranswer =",userAnswer)

        res.status(201).json({ status: true, userAnswer:userAnswer });
    } 
    catch (error) 
    {
        console.error('Error saving quiz question:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
}
);

// router to get user saved answer

// router.get('/get-user-saved-answer', async (req, res) => {
//     try
//      {

//         let status = req.header("status")
//         let course = req.header('course')
//         let date = req.header("examDate")

//         // Include user ID from the middleware

//         console.log("data get save user =",date,course,status)

//         let userAnswer = []

//         if(course =="all"){

//             console.log("if condition = ",course)

//             userAnswer = await saveQuiz.find({status:status, date:date})
//         }

//         else{

//             userAnswer = await saveQuiz.find({status:status, date:date, category:course})

//         }


//         res.status(201).json({ status: true, userAnswer:userAnswer });
//     } 
//     catch (error) 
//     {
//         console.error('Error saving quiz question:', error);
//         res.status(500).json({ status: false, error: 'Server error' });
//     }
// });

router.get('/get-user-saved-answer', async (req, res) => {
    try {
        const status = req.header("status");
        const course = req.header("course");
        const startDate = req.header("startDate");
        const endDate = req.header("endDate");

        console.log("Received parameters =", { status, course, startDate, endDate });

        let userAnswer = [];

        if (course === "all") {
            // console.log("Fetching for all courses");
            userAnswer = await saveQuiz.find({
                status: status,
                date: { $gte: startDate, $lte: endDate }
            });
        } else {
            // console.log(`Fetching for course: ${course}`);
            userAnswer = await saveQuiz.find({
                status: status,
                date: { $gte: startDate, $lte: endDate },
                category: course
            });
        }

        res.status(201).json({ status: true, userAnswer });
    } catch (error) {
        console.error('Error fetching user saved answers:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});



router.get('/fetch-quiz/:year/:month', async (req, res) => 
    {
    try {
        const { year, month } = req.params;

        // Parse year and month to integers
        const yearInt = parseInt(year);
        const monthInt = parseInt(month);

        // Get the start and end dates of the month
        const startDate = new Date(yearInt, monthInt - 1, 1); // Start of the month
        const endDate = new Date(yearInt, monthInt, 1);       // Start of the next month

        // Query to fetch quizzes based on the date field (using date range)
        const quizzes = await saveQuiz.find({
            date: {
                $gte: startDate, // Greater than or equal to the start of the month
                $lt: endDate     // Less than the start of the next month
            }
        });

        console.log("data quizzes =", quizzes, yearInt, monthInt);

        res.status(200).json({ status: true, data: quizzes });
    } 
    catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});


router.get('/all-category', async (req, res) => {

    try{

    const allCategory = await categories.find({})

    res.send({ "status": "true", allCategory:allCategory });

    }
    catch(error){
        console.log("all category route error =",error.message)
        res.send({ "status": "false" });

    }
});

router.get('/all-course', async (req, res) => {

    console.log("all course get route")
    try{

    const allCourseData = await allCourse.find({})

    res.send({ "status": "true", allCourse:allCourseData });

    }
    catch(error){
        console.log("all category route error =",error.message)
        res.send({ "status": "false" });

    }
});
router.get('/sub-course', async (req, res) => {

    let mainCourse = req.header("mainCourse")

    console.log("sub course get route",mainCourse)
    try{

    const subCourseData = await allCourse.find({mainCourse:mainCourse})

    res.send({ "status": "true", subCourse:subCourseData });

    }
    catch(error){
        console.log("all category route error =",error.message)
        res.send({ "status": "false" });

    }
});



module.exports = router;
