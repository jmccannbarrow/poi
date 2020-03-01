'use strict';

const Accounts = require('./app/controllers/accounts');
const Landmarks = require('./app/controllers/landmarks');
const Gallery = require('./app/controllers/gallery');

module.exports = [

    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'GET', path: '/listusers/deleteUser/_id', config: Accounts.deleteUser },
    //{ method: 'POST', path: '/manageusers/deleteUser/_id', config: Accounts.deleteUser },



    { method: 'GET', path: '/loginadmin', config: Accounts.showLoginAdmin },
    { method: 'GET', path: '/logoutadmin', config: Accounts.logoutadmin },
    { method: 'POST', path: '/loginadmin', config: Accounts.loginadmin},

    { method: 'GET', path: '/adminlanding', config: Accounts.adminlandingtest },
    { method: 'POST', path: '/adminlanding', config: Accounts.adminlandingtest },

    { method: 'GET', path: '/createuser', config: Accounts.showCreateuser },
    { method: 'POST', path: '/createuser', config: Accounts.createuser },

    { method: 'GET', path: '/usersettings/showEdituser/', config: Accounts.showEdituser },
    { method: 'POST', path: '/usersettings', config: Accounts.edituser },


      { method: 'GET', path: '/home', config: Landmarks.home },
    { method: 'GET', path: '/report',  config: Landmarks.report },
    { method: 'POST', path: '/landmark', config: Landmarks.landmark },




    { method: 'GET', path: '/poilist',  config: Landmarks.poilist },




    { method: 'GET', path: '/manageusers',  config: Accounts.manageusers },


   { method: 'GET', path: '/landmarksettings/showLandmarkSettings/{id}', config: Landmarks.showLandmarkSettings },
    { method: 'POST', path: '/landmarksettings', config: Landmarks.updateLandmarkSettings },

    //{ method: 'GET', path: '/deleteLandmark/:id', config: Landmarks.deleteLandmark },
  //  { method: 'POST', path: '/landmark/deleteLandmark', config: Landmarks.deleteLandmark },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }

];