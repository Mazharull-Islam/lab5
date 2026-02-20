const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.get('/check', (req, res) => {
    res.json({ message: "Hello from the router!" });
});

const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json()); //allows your application to read and parse JSON data sent in the request body.
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});


//listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



//routes
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const developerRoutes = require('./routes/developerRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');

app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/tournaments', tournamentRoutes);



//monngodb connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MongoDB_URI).then(() => {
    console.log('Connected to MongoDB');
    //     app.listen(PORT, () => {
    //     console.log(`Server is running on http://localhost:${PORT}`);
    // });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//install node js
// npm init -y
//npm i express dotenv



// npm install -g nodemon       and then run as nodemon index.js   then don't need to restart the server everytime
//nodemon -g  npm run dev


//env dotenv
//postman
//mongodv:
//npm i mongodb mongoose (mongoose is what's known as an odm library and odm stands for object data modeling it basically wraps mongodb with
// an extra layer that allows us to use methods to read and write database documents and it also gives us a way to declare models and
// schemas to ensure a more strict data structure)
//.env  MongoDB_URI="your_mongodb_connection_string"