'use strict';

const Landmark = require('../models/landmark');
const User = require('../models/user');
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
            const user = await User.findById(id);
            const data = request.payload;


                const newLandmark = new Landmark({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    userid: id,

                });
                await newLandmark.save();
                return h.redirect('/report');

        }
    },




    showLandmarkSettings: {


        handler: async function(request, h) {
            try {

                const landmarkid = request.params.id;
                console.log(landmarkid);

                const landmark = await Landmark.findById(landmarkid).lean();

                console.log("before landmark._id");

                console.log(landmark._id);

                console.log("after landmark._id");


                return h.view('editlandmark', {title: 'Edit Landmark', landmark: landmark});
            } catch (err) {
                return h.view('/', {errors: [{message: err.message}]});
            }
        }
    },







    updateLandmark: {
        handler: async function(request, h) {
            try {

                console.log("in updatelandmark");

                const landmarkedit = request.payload;

                console.log(landmarkedit.name);
                console.log(landmarkedit.description);

                const landmarkid = request.params.id;
                console.log(landmarkid);


                console.log("here");

                const landmark  = await Landmark.findById(landmarkid);
                landmark.name = landmarkedit.name;
                landmark.description = landmarkedit.description;

                await landmark.save();
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
        handler: async function (request, h) {
            try {

                const landmarkid = request.params.id
                console.log(landmarkid)

                const landmark  = await Landmark.findById(landmarkid)
                console.log(landmarkid)
                const deleteLandmark  = await Landmark.findByIdAndRemove(landmarkid);
                console.log(deleteLandmark)

                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }

    },

};



module.exports = Landmarks;