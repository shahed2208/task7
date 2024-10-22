const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port = 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/courses', require('./routes/courseRoute'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});