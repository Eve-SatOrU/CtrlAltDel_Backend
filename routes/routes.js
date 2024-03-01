
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ambulanceController = require('../controllers/civilProtectionController');
const hospitalController = require('../controllers/hospitalController');
const policeController = require('../controllers/policeController');
// i think i will put all routes here anyway lesss gooo


// user routes 
router.get('/register', userController.getRegister);
router.post('/register' , userController.postRegister);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.post('/logout', userController.postLogout);
// profile
router.get('/profile/:id', userController.getProfile);
// delete account
router.delete('/delete-account/:id', userController.deleteAccount);
router.get('/policeNotifications/:id', policeController.policeNotifications);
router.get('/hospitalNotifications/:id', hospitalController.hospitalNotifications);
router.post('/ambulance-form', ambulanceController.postAmbulanceForm);


module.exports = router;