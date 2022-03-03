const router = require('express').Router()
const companyModel = require('../models/company')
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyJWT} = require('../routes/verifyJWT')


router.post('/', verifyTokenAndAdmin, async (req, res ) => {
    const newcompany = companyModel(req.body)
    try {
        const company = await newcompany.save()

        res.status(201).json(company)
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

router.get("/",verifyJWT, async (req, res) => {

    try {
        
        company = await companyModel.find();
    
        res.status(200).json(company);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id',verifyTokenAndAdmin, async (req, res ) => {
    const company = companyModel.findById(req.params.id)
    if (!company) {
        return res.status(404).send('The company with the given ID was not found.')
    }
    try {
        const company = await companyModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
            }, {new: true})

        res.status(200).json(company)

    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res ) => {
    try {
        const company = await companyModel.findByIdAndDelete(req.params.id)
       
        res.status(200).json("company deleted")
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

router.get('/:id', verifyJWT, async (req, res ) => {
    try {
        const company = await companyModel.findById(req.params.id)
        res.status(200).json(company)
    } catch (error) {
        res.status(403).json("Error: " + error)
    }
})

 
module.exports = router