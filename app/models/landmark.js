'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;




const landmarkSchema = new Schema({
    name: String,
    description: String,
    category: String,
    userid: String,

    imageURL: String

});

landmarkSchema.statics.findById = function(id) {
    return this.findOne({ id : id});

    landmarkSchema.statics.findByName = function(name) {
        return this.findOne({ name: name });
    };

    landmarkSchema.statics.findByIdAndRemove = function (id) {
        return this.findOne({id : id});

    }

};









module.exports = Mongoose.model('Landmark', landmarkSchema);