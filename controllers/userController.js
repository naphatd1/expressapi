const argon2 = require('argon2');
const {validationResult} = require('express-validator')
const models = require('../models/index')
const jwt = require('jsonwebtoken')
const config = require('../config/index')
exports.index = async (req, res, next) => {

    // const users = await models.User.findAll()

    // const users = await models.User.findAll({
    //     attributes: ['id', 'fullname', 'email', 'created_at'], //เลือก filed
    //     order: [['id', 'desc']]
    // })

    // const users = await models.User.findAll({
    //     attributes: {exclude: ['password']} , ยกเลิก field
    //     order: [['id', 'desc']]
    // })

    // const users = await models.User.findAll({
    //     attributes: {exclude: ['password']} ,
    //     where: {email: 'naphat.d@gmail.com'},
    //     order: [['id', 'desc']]
    // })

    // const users = await models.User.findAll({
    //     attributes: ['id', 'fullname', ['email', 'username'], 'created_at'],
    //     order: [['id', 'desc']]
    // })

    const sql = 'select id,fullname,lastname,email,password,created_at from users order by id desc'
    const users = await models.sequelize.query(sql, {
        type: models.sequelize.QueryTypes.SELECT
    })

    res.status(200).json(
        {data: users}
    )
}

exports.show = async (req, res, next) => {
    try {
        const {id} = req.params
        const users = await models.User.findByPk(id, {
            attributes: {exclude: ['password']}
        })
        if (!users) {
            const error = new Error('ไม่พบผู้ใช้นี้ในระบบ')
            error.statusCode = 404
            throw  error
        }
        res.status(200).json({
            data: users
        })
    } catch (error) {
        res.status(error.statusCode).json({
            error: {
                message: error.message
            }
        })
    }
}

exports.insert = async (req, res, next) => {
    try {
        const {fullname, lastname, email, password, role} = req.body

        //validation
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error('ข้อมูลที่รับมาไม่ถูกต้อง')
            error.statusCode = 422
            error.validation = errors.array()
            throw  error
        }

        const existEmail = await models.User.findOne({where: {email: email}})
        if (existEmail) {
            const error = new Error('มีผู้ใช้นี้ในระบบแล้ว')
            error.statusCode = 400
            throw  error
        }

        // hash password
        // const salt = await  bcrypt.genSalt(8)
        // const passwordHash = await bcrypt.hash(password)
        const hashPassword = await argon2.hash(password);
        const users = await models.User.create({
            fullname: fullname,
            lastname: lastname,
            email: email,
            password: hashPassword,
            role: role
        })

        res.status(201).json({
            message: "Success Register",
            data: {
                id: users.id,
                fullname: users.fullname,
                lastname: users.lastname,
                email: users.email,
                password: users.password,
                role: users.role
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.update = async (req, res, next) => {
    try {
        const {id, fullname, lastname, email, password, role} = req.body
        if (req.params.id !== id) {
            const error = new Error('รหัสมีผู้ใช้ไม่ถูกต้อง')
            error.statusCode = 400
            throw  error
        }
        // hash password
        const hashedPassword = await argon2.hash(password);
        const users = await models.User.update({
            fullname: fullname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: role
        }, {
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: "Success Update User"
        })
    } catch (error) {
        res.status(error.statusCode).json({
            error: {
                message: error.message
            }
        })
    }
}

exports.destroy = async (req, res, next) => {
    try {

        const {id} = req.params
        const users = await models.User.findByPk(id)

        if (!users) {
            const error = new Error('ไม่พบผู้ใช้นี้ในระบบ')
            error.statusCode = 404
            throw  error
        }

        // delete user by id
        await models.User.destroy({
            where: {
                id: id
            }
        })

        res.status(200).json({
            message: "Delete User"
        })
    } catch (error) {
        res.status(error.statusCode).json({
            error: {
                message: error.message
            }
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await models.User.findOne({where: {email: email}})
        if (!user) {
            const error = new Error('ไม่พบผู้ใช้งานในระบบ')
            error.statusCode = 404
            throw  error
        }

        //verify password
        const storedHashedPassword = user.password
        const passwordMatches = await argon2.verify(storedHashedPassword, password);
        if (!passwordMatches) {
            const error = new Error('รหัสผ่านไม่ถูกต้อง')
            error.statusCode = 401
            throw  error
        }

        // token
        const token = await jwt.sign({
            id: user.id,
            role: user.role
        }, config.JWT_SECRET, {expiresIn: '5 days'})

        //decode
        const expires_in = jwt.decode(token)

        res.status(200).json({
            access_token: token,
            expires_in: expires_in.exp,
            token_type: 'Bearer',
            message: "Login Success"
        })
    } catch (error) {
        next(error)
    }
}

exports.me = async (req, res, next) => {
    const {id, fullname, lastname, email, role} = req.user
    res.status(200).json({
        user: {
            id: id,
            fullname: fullname,
            lastname: lastname,
            email: email,
            role: role
        }
    })
}