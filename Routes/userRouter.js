const express = require('express');
const app = express();
const usercontrol = require('../controllers/usercontrol.js');
const userrouter = express.Router();







//users route
userrouter.route('/').get(usercontrol.getAllusers).post(usercontrol.newuser);
userrouter.route('/:id').get(usercontrol.getuser).patch(usercontrol.updateuser).delete(usercontrol.deleteuser);

module.exports = userrouter;