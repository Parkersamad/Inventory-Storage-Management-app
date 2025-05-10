const dotenv = require('dotenv').config();
const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes Middlewears
app.use("/api/users", userRoute)

//Routes
app.get("/", (req, res) => {
    res.send("Home Page")
});

// Error Middleware
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
// Connect to MongoDB and start server
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

})
.catch((err) => console.log(err));