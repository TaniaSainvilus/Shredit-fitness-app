const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    shredTarget:  { type: String, required: true },
    shredWorkout:  { type: String, required: true },
    img:  { type: String, required: true },
    video:  { type: String, required: true },
    readyToShred: Boolean
});

const Workouts = mongoose.model('Workouts', workoutSchema);

module.exports = Workouts;