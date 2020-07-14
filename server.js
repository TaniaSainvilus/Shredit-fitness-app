//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/' + 'workouts';

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static(__dirname + '/public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });

//import workouts model
const Workouts = require('./models/workouts.js');

// app.get('/', (req, res)=>{
//     Workouts.find({}, (error, allWorkouts)=>{
//       res.render('login.ejs')
//     })
//   })

//Index
app.get('/', (req, res)=>{
    console.log("In GET '/'")
    Workouts.find({}, (error, allWorkouts)=>{
        if(doc.length === 0 || err){
            console.log(err);
           res.render('error', { errorMsg: err } )
        }
      res.render('index.ejs', {
        workouts: allWorkouts
      })
    })
  })

  //News
  app.get('/workouts/new', (req, res)=>{
    res.render('new.ejs');
});
// show////
app.get('/workouts/:id', (req, res) =>{
    Workouts.findById(req.params.id, (err, foundWorkout)=>{
      res.render('show.ejs', {
        workout: foundWorkout,
      })
    })
  })

  // show////
app.get('/workouts/:id/edit', (req, res) =>{
    Workouts.findById(req.params.id, (err, foundWorkout)=>{
    res.render('edit.ejs', {
      workout: foundWorkout,
    })
  })
})

  //Post
  app.post('/workouts', (req, res) => {
    if(req.body && req.body.readyToShred){
      req.body.readyToShred = (req.body.readyToShred == "on" ? true : false);
    }
    Workouts.create(req.body, (err, newWorkout) => {
      console.log("created workout")
      res.redirect('/');
    });
  });

  //Edit
  app.put('/workouts/edit/:id', (req, res) => {
    if(req.body && req.body.readyToShred){
      req.body.readyToShred = (req.body.readyToShred == "on" ? true : false);
    }
    Workouts.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel)=> {
      res.redirect('/workouts/'+req.params.id);
    })
  });

  //Delete

  app.delete('/workouts/:id', (req, res) => {
    Workouts.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, data)=>{
      res.redirect('/') //redirect back to index
    })
  })
//___________________
//Listener 
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));