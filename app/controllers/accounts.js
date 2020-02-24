'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Boom = require('@hapi/boom');

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Famous Irish Landmarks' });
        },


    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Famous Irish Landmarks' });
        }
    },
    signup: {
        auth: false,
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw Boom.badData(message);
                }
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/home');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Famous Irish Landmarks' });
        }
    },
    login: {
        auth: false,
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/report');
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    logout: {
        handler: function(request, h) {

            return h.redirect('/');
        }
    },
    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', { title: 'User Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    updateSettings: {
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },



    showLoginAdmin: {
        auth: false,
        handler: function(request, h) {
            return h.view('loginadmin', { title: 'Login to Famous Irish Landmarks' });
        }
    },
    loginadmin: {
        auth: false,
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let admin = await Admin.findByEmail(email);
                if (!admin) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                admin.comparePassword(password);
                request.cookieAuth.set({ id: admin.id });
                return h.redirect('/manageusers');
            } catch (err) {
                return h.view('loginadmin', { errors: [{ message: err.message }] });
            }
        }
    },
    logoutadmin: {
        handler: function(request, h) {

            return h.redirect('/');
        }
    },

    listofusers: {
        auth: false,
        handler: function(request, h) {
            return h.view('manageusers', { title: 'This is a list of users' });
        }
    },

    //adminlandingtest: {
    //    handler: function(request, h) {

    //        return h.redirect('/report2');
    //    }
    //},

    adminlandingtest: {
        auth: false,
        handler: function(request, h) {
            return h.view('manageusers', { title: 'This is admin landing' });
        }
    },


    manageusers: {
        handler: async function(request, h) {
            const users = await User.find().populate('contributor').lean();
            return h.view('manageusers', {
               title: 'Users to Date',
                users:users
           });
        }
    },


    deleteUser: {
        handler: async function(request, h) {
            try {
                const userDelete = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                await user.remove();
                return h.redirect('/');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },



};

module.exports = Accounts;