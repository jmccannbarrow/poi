'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;




const categorySchema = new Schema({
    name: String,
    userid: String

});

//categorySchema.statics.findById = function(id) {
    return this.findOne({ id : id});

    categorySchemaSchema.statics.findByIdAndRemove = function (id) {
        return this.findOne({id : id});

    }