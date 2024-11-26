const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
