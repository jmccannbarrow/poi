const Landmarks = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Famous Irish Landmarks' });
        }
    },
    report: {
        handler: function(request, h) {
            return h.view('report', {
                title: 'Landmarks to Date',
                landmarks: this.landmarks
            });
        }
    },
    landmark: {
        handler: function(request, h) {
            const data = request.payload;
            this.landmarks.push(data);
            return h.redirect('/report');
        }
    }
};

module.exports = Landmarks;