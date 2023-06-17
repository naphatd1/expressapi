const express = require('express');
const {body} = require('express-validator')
const router = express.Router();
const userController = require('../controllers/userController')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require("../middleware/checkAdmin");

//http://localhost:6666/api/users
router.get('/' ,[passportJWT.isLogin], userController.index);

//http://localhost:6666/api/users/:id
router.get('/:id',[passportJWT.isLogin], userController.show);

//http://localhost:6666/api/users/
router.post('/', [
    body('fullname').not().isEmpty().withMessage('กรุณาป้อนชื่อด้วย'),
    body('lastname').not().isEmpty().withMessage('กรุณาป้อนนามสกุลด้วย'),
    body('email').not().isEmpty().withMessage('กรุณาป้อนอีเมล์ด้วย').isEmail().withMessage('รูปแบบอีเมล์ไม่ถูกต้อง'),
    body('password').not().isEmpty().withMessage('กรุณาป้อนรหัสผ่านด้วย').isLength({min: 3}).withMessage('รหัสผ่าน3ตัวขึ้นไป'),
], [passportJWT.isLogin] , userController.insert);

//http://localhost:6666/api/users/update
router.put('/:id', userController.update);

//http://localhost:6666/api/users/delete
router.delete('/:id',[passportJWT.isLogin], userController.destroy);

//http://localhost:6666/api/users/login
router.post('/login', userController.login);

//http://localhost:6666/api/users/me
router.get('/me', userController.me);
module.exports = router;
