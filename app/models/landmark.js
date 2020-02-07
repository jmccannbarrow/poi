'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;



const landmarkSchema = new Schema({
    name: String,
    description: String,
    category: String,
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Mongoose.model('Landmark', landmarkSchema);