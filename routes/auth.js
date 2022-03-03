require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const employeeModel = require('../models/employee')

router.route('/register')
    .post(async (req, res ) => {

        const {name, email, password, company } = req.body
        if (!name || !email || !password ) return res.status(400).json({'message': 'input required fields'})
        if ( company ) return res.status(400).json({'message': 'You are not allowed to assign yourself a company'})

        
        try {
            const hashedPwd = await bcrypt.hash(req.body.password, 10)
            const response = await employeeModel.create({
                name: req.body.name,
                email: req.body.email,
                company: req.body.company,
                password: hashedPwd,
            })

            const {password, ...others} = response._doc

            res.status(201).json(others)
        } catch (error) {
            res.status(500).json(error.message)
        }
    })


router.route('/login')
    .post(async (req, res ) => {
        console.log('login')

        const {name, password } = req.body
        if (!name || !password) return res.status(400).json({'message': 'input required fields'})
        
        try {
            const user = await employeeModel.findOne({name: req.body.name})
            if (!user) return res.status(204).json('no employee found')

            const passwordMatch = bcrypt.compare(user.password, req.body.password)
            if (passwordMatch) {
                
                const accessToken =jwt.sign(
                    {"id": user.id, "isAdmin": user.isAdmin},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '3d'}
                )
                const {password, ...others} = user._doc

                res.status(200).json({...others, accessToken})
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    })


module.exports = router