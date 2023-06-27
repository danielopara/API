const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('./model/userModel')

router.get('/', (req, res, next)=>{
    User.find()
    .exec()
    .then(doc=>{
        console.log(doc)
        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    })
})


router.post('/', (req,res,next)=>{
    const user = new User({
        _id : new mongoose.Types.ObjectId(),
        displayName : req.body.displayName,
        description : req.body.description
    })
    user.save().then(result=>{
        console.log(result)
        res.status(200).json({
            message : "Posted User",
            userCreated : user
        })
    }).catch(err=>{
        res.status(500).json({
            error : err
        })
    })
})

router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId
   User.findById(id)
   .exec()
   .then(doc =>{
    if(doc){
        console.log(doc)
        res.status(200).json(doc)
    } else {
        res.status(404).json({
            message: "ID does not exist"
        })
    }
   })
   .catch(err=>{
    console.log(err)
    res.status(500).json({
        error: err
    })
   })
})


router.patch('/:userId', (req, res, next)=>{
    const id = req.params.userId
    const updates = {}
    for(const para of req.body){
     updates[para.propName] = para.value
    }
    User.updateOne({_id: id},  {$set: updates})
    .exec()
    .then((result)=>{
     console.log(result)
     res.status(200).json(result)
    })
    .catch(err=>{
     console.log(err)
     res.json(500).json({
         error: err
     })
    })
 }) 

router.delete('/:userId', (req, res, next)=>{
    const id = req.params.userId
    User.remove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json(err)
    })
}) 

module.exports = router;