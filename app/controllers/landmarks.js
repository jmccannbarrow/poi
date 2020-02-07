'use strict';

const Landmark = require('../models/landmark');
const User = require('../models/user');

const Landmarks = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Famous Irish Landmarks' });
        }
    },
    report: {
        handler: async function(request, h) {
            const landmarks = await Landmark.find().populate('contributor').lean();
            return h.view('report', {
                title: 'Landmarks to Date',
                landmarks:landmarks
            });
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
                contributor:user._id
            });
            await newLandmark.save();
            return h.redirect('/report');
        }
    }
};

module.exports = Landmarks;