// start of route for quiz
router.post('/upload-questions', upload.single('file'), async (req, res) => {
    console.log("Bulk question upload running");
    try {
        const filePath = req.file.path;
        let questions = [];

        // Process CSV or Excel file based on MIME type
        if (req.file.mimetype === 'text/csv') {
            const csvData = fs.readFileSync(filePath, 'utf8');
            const parsedData = Papa.parse(csvData, { header: true });
            questions = parsedData.data;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            questions = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            return res.status(400).json({ status: false, message: 'Unsupported file format' });
        }

        fs.unlinkSync(filePath); // Delete the uploaded file after processing

        let addedCount = 0; // Track successfully added questions
        let failedCount = 0; // Track failed questions

        for (const question of questions) {
            try {
                const { question: ques, option1, option2, option3, option4, answer, category, type } = question;

                // Create a new question object
                const newQuestion = new questiondb({
                    question: ques,
                    option1,
                    option2,
                    option3,
                    option4,
                    answer,
                    type,
                    category
                });

                // Save the question to the database
                const savedQuestion = await newQuestion.save();

                // Check if category exists and update total question count
                const categoryDb = await categories.find({ category });
                if (categoryDb.length > 0) {
                    const totalQuestion = parseInt(categoryDb[0].totalQuestion) + 1;
                    await categories.updateOne({ category }, { $set: { totalQuestion } });
                } else {
                    const newCategory = new categories({
                        category,
                        totalQuestion: 1
                    });
                    await newCategory.save();
                }

                addedCount++;
            } catch (error) {
                console.error('Error processing question:', question, error);
                failedCount++;
            }
        }

        res.status(201).json({
            status: true,
            message: 'Bulk upload completed',
            added: addedCount,
            failed: failedCount
        });
    } catch (error) {
        console.error('Error during bulk upload:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
});


router.post('/add-question', async (req, res) => {
    console.log("add question running")
    try {
        console.log("req body add-question =",req.body)
        const { question, option1, option2, option3, option4, answer, category, type } = req.body;

        // Create a new question
        const newQuestion = new questiondb({
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
            type,
            category
        });

        // Save the question to the database
        const savedQuestion = await newQuestion.save();
        const categoryDb = await categories.find({category:category});
        if(categoryDb.length>0){
            const totalQuestion = parseInt(categoryDb[0].totalQuestion) + 1

            await categories.updateOne({category:category}, {$set:{totalQuestion:totalQuestion}})
        }
        else{
            
            const newCategory = new categories({
                category:category,
                totalQuestion:1
            });
    
            // Save the question to the database
          await newCategory.save();

        }

        res.status(201).json({ "status":true,message: 'Question added successfully', question: savedQuestion });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({"status":false, error: 'Server error' });
    }
});


router.get('/get-question', async (req, res) => {
    try {
       const category = req.header("category")
       console.log("category =",category)

       const allQuestions  = await questiondb.find({category:category});
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
        console.log("verify user true")
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
            date:new Date()
        };

        console.log("quiz data =",quizData)

      
        await saveQuiz.updateOne({user:req.userId, category:data.category},{$set:quizData},{upsert:true})

        res.status(201).json({ status: true });
    } 
    catch (error) {
        console.error('Error saving quiz question:', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});

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

        // Include user ID from the middleware

        const userAnswer = await saveQuiz.find({category:category,user:req.userId})

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

router.get('/get-user-saved-answer', async (req, res) => {
    try
     {

        let status = req.header("status")

        // Include user ID from the middleware

        const userAnswer = await saveQuiz.find({status:status})

        res.status(201).json({ status: true, userAnswer:userAnswer });
    } 
    catch (error) 
    {
        console.error('Error saving quiz question:', error);
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

    const allCourseData = await subCourse.find({})

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

    const subCourseData = await subCourse.find({mainCourse:mainCourse})

    res.send({ "status": "true", subCourse:subCourseData });

    }
    catch(error){
        console.log("all category route error =",error.message)
        res.send({ "status": "false" });

    }
});