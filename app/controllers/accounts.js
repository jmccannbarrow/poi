'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const Landmark = require('../models/landmark');

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
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
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
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
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

    showsignupadmin: {
        auth: false,
        handler: function(request, h) {
            return h.view('signupadmin', { title: 'Sign up for Famous Irish Landmarks' });
        }
    },

    signupadmin: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let admin = await Admin.findByEmail(payload.email);
                if (admin) {
                    const message = 'Email address is already registered';
                    throw Boom.badData(message);
                }
                const newAdmin = new Admin({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password
                });
                admin = await newAdmin.save();
                request.cookieAuth.set({ id: admin.id });
                return h.redirect('/manageusers');
            } catch (err) {
                return h.view('signupadmin', { errors: [{ message: err.message }] });
            }
        }
    },


    showSettings: {
        handler: async function(request, h) {
            try {
                const userid = request.params.id;
                console.log(userid);
                const user = await User.findById(userid).lean();
                console.log(user.email);
                return h.view('settings', { title: 'User Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const userid = request.params.id;
                const user = await User.findById(userid);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/manageusers');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },


    deleteUser: {
        handler: async function (request, h) {
            try {

                const userid = request.params.id;
                const landmarks = await Landmark.find({userid: userid}).lean();

                //IF LANDMARKS dont EXIST FOR USER THEN delete user
                if (landmarks.length == 0) {
                    console.log("Length = 0");
                    const user = await User.findById(userid);
                    await user.remove();

                }
                //Else quit and advise  advise user to delete landmarks
                else {
                    console.log("Length <> 0");

                    const message = 'Landmarks exists for this user. Delete landmarks before deleting the user.';
                    throw Boom.unauthorized(message);

                }

                return h.redirect('/manageusers');


            } catch (err) {
                return h.view('main', {errors: [{message: err.message}]});
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
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('loginadmin', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
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

    showCreateuser: {
        auth: false,
        handler: function(request, h) {
            return h.view('createuser', { title: 'Sign up for Famous Irish Landmarks' });
        }
    },


    createuser: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
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
                return h.redirect('/manageusers');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
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




};

module.exports = Accounts;