const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    logo: { type: String, required: true},
    url: { type: String, required: true},

}, { timestamps: true })


module.exports = mongoose.model('company', companySchema)