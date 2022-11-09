const mongoose = require('mongoose')
const emailSchema = new mongoose.Schema({
    to : {
        type: String,
        required: true
    },

    subject : {
        type: String,
        required: true

    },
    
    text : {
        type: String,
         required: true,
    },

    scheduletime: {
        type: String,
         required: true,
    }
})
module.exports = mongoose.model('email', emailSchema)