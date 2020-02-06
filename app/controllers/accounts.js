'use strict';

const Accounts = {
    index: {
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Famous Irish Landmarks' });
        }
    },
    showSignup: {
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Famous Irish Landmarks' });
        }
    },
    signup: {
        handler: function(request, h) {
            return h.redirect('/home');
        }
    },
    showLogin: {
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Famous Irish Landmarks' });
        }
    },
    login: {
        handler: function(request, h) {
            return h.redirect('/home');
        }
    },
    logout: {
        handler: function(request, h) {
            return h.redirect('/');
        }
    }
};

module.exports = Accounts;