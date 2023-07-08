const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    displayName : {type : String, required : true},
    description : {type : String, required : true},
    userImage : {type : String },
    backgroundImage : {type : String}
})

module.exports = mongoose.model("User", userSchema)