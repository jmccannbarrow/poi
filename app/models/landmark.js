'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;




const landmarkSchema = new Schema({
    name: String,
    description: String,
    category: String,
    userid: String,
    imageURL: String,

});


landmarkSchema.statics.findById = function(id) {
    return this.findOne({ _id : id});


};









module.exports = Mongoose.model('Landmark', landmarkSchema);