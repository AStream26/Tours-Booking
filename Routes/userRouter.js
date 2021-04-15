const express = require('express');
const app = express();
const usercontrol = require('../controllers/usercontrol.js');
const authcontrol = require('../controllers/Authcontroller.js');
const userrouter = express.Router();





userrouter.route('/singup').post(authcontrol.singup);
userrouter.route('/login').post(authcontrol.login);
userrouter.route('/forgotpassword').post(authcontrol.forgotPassword);
userrouter.route('/resetpassword/:token').post(authcontrol.resetpassword);


//Protect all routes after this middle ware
userrouter.use(authcontrol.protect);

userrouter.route('/updatepassword').patch(authcontrol.updatePassword);
userrouter.route('/me').get(usercontrol.getMe,usercontrol.getuser);
userrouter.route('/updateuser').post(usercontrol.updateMe);
userrouter.route('/deleteuser').delete(usercontrol.deleteMe);


//users route

userrouter.use(authcontrol.validateuser("admin"));
userrouter.route('/').get(usercontrol.getAllusers).post(usercontrol.newuser);
userrouter.route('/:id').get(usercontrol.getuser).patch(usercontrol.updateuser).delete(usercontrol.deleteuser);






module.exports = userrouter; 