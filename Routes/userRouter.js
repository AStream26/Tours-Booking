const express = require('express');
const app = express();
const usercontrol = require('../controllers/usercontrol.js');
const authcontrol = require('../controllers/Authcontroller.js');
const userrouter = express.Router();





userrouter.route('/singup').post(authcontrol.singup);
userrouter.route('/login').post(authcontrol.login);
userrouter.route('/forgotpassword').post(authcontrol.forgotPassword);
userrouter.route('/resetpassword/:token').post(authcontrol.resetpassword);
userrouter.route('/updatepassword').patch(authcontrol.protect,authcontrol.updatePassword);

userrouter.route('/updateuser').post(authcontrol.protect,usercontrol.updateMe);
userrouter.route('/deleteuser').delete(authcontrol.protect,usercontrol.deleteMe);


//users route
userrouter.route('/').get(usercontrol.getAllusers).post(usercontrol.newuser);
userrouter.route('/:id').get(usercontrol.getuser).patch(usercontrol.updateuser).delete(usercontrol.deleteuser);






module.exports = userrouter; 