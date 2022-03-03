const router = require('express').Router()
const employeeModel = require('../models/employee')
const companyModel = require('../models/company')
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyJWT} = require('../routes/verifyJWT')
const { nextTick } = require('process')


router.post('/',verifyTokenAndAdmin, async (req, res ) => {
    const newEmployee = employeeModel(req.body)
    try {
        const employee = await newEmployee.save()
        console.log(employee)

        res.status(200).json(employee)
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        
        employee = await employeeModel.find();
        

        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', verifyJWT, async (req, res ) => {

    if (!req.user.isAdmin) {
        const {company} = req.body
        if (company) {
            return res.status(403).send("You are not allowed to update your company!")
        }
    }

    const employee = await employeeModel.findById(req.params.id)
    if (!employee) {
        return res.status(404).send('The employee with the given ID was not found.')
    }
    try {
        const company = await companyModel.find({name: req.body.company})
        if (!company) {
            return res.status(404).send('The company with the given name was not found.')
        }
        const employee = await employeeModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
            }, {new: true})

        res.status(200).json(employee)

    } catch (error) {
        res.status(403).json("Error: " + error)
    }
    
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res ) => {
    try {
        const employee = await employeeModel.findByIdAndDelete(req.params.id)
       
        res.status(200).json("employee deleted")
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

router.get('/:id', verifyJWT, async (req, res ) => {
    try {
        const employee = await employeeModel.findById(req.params.id)
        res.status(200).json(employee)
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

    
module.exports = router