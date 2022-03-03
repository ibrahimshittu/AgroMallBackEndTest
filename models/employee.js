const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    company: { type: String, required: false, default: "freelancer"}, // if company is not assigned, it means that the employee is a freelancer
    isAdmin: { type: Boolean, default: false},

}, { timestamps: true })


module.exports = mongoose.model('employee', employeeSchema)