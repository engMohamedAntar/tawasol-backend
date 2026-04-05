const express = require('express');
const connectDB = require('./config/dbConnection');
require('dotenv').config();

const app= express();
app.use(express.json());

connectDB();  

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/posts', require('./routes/postsRoute'));
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/profiles', require('./routes/profileRoute'));

const PORT= process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`)); 