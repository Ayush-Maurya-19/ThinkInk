const mongoose = require('mongoose');

const url = "mongodb+srv://Ayush:ayush@cluster0.oy69d4x.mongodb.net/?retryWrites=true&w=majority";

// asynchronous - return Promise
mongoose.connect(url)
.then((result) => {
    console.log('database connected successfully');
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose;