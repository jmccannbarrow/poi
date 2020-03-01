'use strict';

const cloudinary = require('cloudinary');
const Landmark = require('../models/landmark');
const User = require('../models/user');
const ImageStore = require('../utils/image-store');
const Joi = require('@hapi/joi');




const Landmarks = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Famous Irish Landmarks' });
        }
    },
    report: {
        handler: async function(request, h) {
            try{
                const id = request.auth.credentials.id;
                const landmarks = await Landmark.find({userid: id}).lean();
                return h.view('report', {
                    title: 'Landmarks to Date',
                    landmarks:landmarks
                });
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },
    landmark: {
        handler: async function(request, h) {
            const id = request.auth.credentials.id;
            const data = request.payload;
            const name = data.name;
            const filename = data.imagefile;
            const file = "C:\\landmarkimages\\" + filename;
            console.log(file);

            console.log("Before Upload");

           // const file = request.payload.imagefile;
            //const serverPath = "http://res.cloudinary.com/dzpmc2rgn/image/upload/v1582667617/";
            //const serverPath = "test"
            //const fileURL = serverPath + filename + ".jpg";

           // if (Object.keys(file).length > 0) {
                await ImageStore.uploadImage(file, name);

                console.log("After Upload");

                const newLandmark = new Landmark({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    userid: id,
                    //imageURL: fileURL
                });
                await newLandmark.save();
                return h.redirect('/report');
            //}
        }
    },

    // editlandmark: {
    //handler: async function(request, h) {
    //const id = request.auth.credentials.id;
    //const data = request.payload;

    //const filename = data.name;
    //const serverPath = "http://res.cloudinary.com/dzpmc2rgn/image/upload/v1582667617/";
    //const fileURL = serverPath + filename + ".jpg";

//pass request and filename to uploadfile

    //const file = request.payload.imagefile;
    //const filename = request.payload.name;

    //if (Object.keys(file).length > 0) {
    //await ImageStore.uploadImage(request.payload.imagefile, filename);
    //return h.redirect('/');
    //}



    //const newLandmark = new Landmark({
    // name: data.name,
    //description: data.description,
    // category: data.category,

    //  userid: id
    // });
    // await newLandmark.save();
    //return h.redirect('/report');
    // }
//filefileURL,

    //},


    payload: {
        multipart: true,
        output: 'data',
        maxBytes: 209715200,
        parse: true
    },


    showLandmarkSettings: {
        handler: async function(request, h) {
            try{
                //const landmarkid= request.auth.credentials.id;
                const landmarkid = request.params.id;
                const landmarksettings = await Landmark.findById({landmarkid: landmarkid})
                console.log("h")
                return h.view('landmarksettings', { title: 'Landmark Settings', landmarksettings : landmarksettings });
            } catch (err) {
                return h.view('/', { errors: [{ message: err.message }] });
            }
        }
    },




    updateLandmarkSettings: {
        handler: async function(request, h) {
            try {
                const landmarkEdit = request.payload;
                const landmarkid = request.params.id;
                console.log("I'm here")
                //const landmark = await Landmark.findById(id)
                const landmark = await Landmark.findById(landmarkid)
                console.log("I get to here")
                //const landmark = await Landmark.findById(id)
                //const landmark = await Landmark.findById(id);
                landmark.name = landmarkEdit.name;
                landmark.description = landmarkEdit.description;
                landmark.category = landmarkEdit.category;
                await landmark.save();
                console.log("end")
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },




    poilist: {
        handler: async function(request, h) {
            const landmarks = await Landmark.find().populate('contributor').lean();
            return h.view('poilist', {
                title: 'Landmarks to Date',
                landmarks:landmarks
            });
        }
    },

    deleteLandmark: {
        handler: async function(request, h) {
            try {
                const landmarkDelete = request.payload;
                const id = request.auth.credentials.id;
                const landmark = await Landmark.findByIdAndRemove(id).lean();
                await landmark.remove();
                return h.redirect('/');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },

};



module.exports = Landmarks;