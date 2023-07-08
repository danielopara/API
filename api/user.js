const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('./model/userModel')
const multer = require('multer')

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, './profileImage/')
    },
    filename : function (req, file, cb){
        cb(null, file.originalname)
    }
})

const storage2 = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, './backgroundImage/')
    },
    filename : function (req, file, cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype == 'image/png'){
    cb(null, true)
    } else{
    cb(null, false);
    console.log('not an image')
    }
}
const profileImage = multer({storage : storage, fileFilter : fileFilter})
const backgroundImage = multer({storage : storage2, fileFilter : fileFilter})

router.get('/', (req, res, next)=>{
    User.find()
    .select('_id displayName description userImage backgroundImage')
    .exec()
    .then(doc=>{
        const response = {
            count : doc.length,
            list : doc.map(doc=>{
                return {
                    _id : doc._id,
                    displayName : doc.displayName,
                    description : doc.description,
                    userImage : doc.userImage,
                    backgroundImage : doc.backgroundImage,
                    details : {
                        type : 'GET',
                        about : 'http://localhost:2020/users/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
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
        description : req.body.description,
    })
    user.save().then(result=>{
        console.log(result)
        res.status(201).json({
            message : "Posted User",
            userCreated : {
                _id : result._id,
                displayName : result.displayName,
                description : result.description,
                userImage : result.userImage,
                backgroundImage : result.backgroundImage,
                moreUsers : {
                    type : 'GET',
                    url : 'http://localhost:2020/users'
                }
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error : err
        })
    })
})

router.post('/:userId/profileImage', profileImage.single('userImage'), async (req, res, next)=>{
    const id = req.params.userId
    const userImage = req.file
   
    try{
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).send('User not found.');
        }
        user.userImage = userImage.filename;
    
        await user.save().then(result=>{
            console.log(result)
            res.status(200).json({
                message : "added profile image",
                user : {
                    id : result._id,
                    displayName : result.displayName,
                    description : result.description,
                    userImage : result.userImage,
                    backgroundImage : result.backgroundImage,
                }
            });
        });
    } catch(err){
        console.error('Error:', err);
        res.status(500).send('Error updating user image.');
    }
})

router.post('/:userId/backgroundImage', backgroundImage.single('backgroundImage'), async (req, res, next)=>{
    const id = req.params.userId
    const backgroundImage = req.file
   
    try{
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).send('User not found.');
        }
        user.backgroundImage = backgroundImage.filename;
    
        await user.save().then(result=>{
            console.log(result)
            res.status(200).json({
                message : "added background image",
                user : {
                    id : result._id,
                    displayName : result.displayName,
                    description : result.description,
                    userImage : result.userImage,
                    backgroundImage : result.backgroundImage,
                }
            });
        });
    } catch(err){
        console.error('Error:', err);
        res.status(500).send('Error updating user image.');
    }
})

router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId
   User.findById(id)
   .exec()
   .then(doc =>{
    if(doc){
        const response = {
            _id : doc._id,
            displayName : doc.displayName,
            description : doc.description,
            userImage : doc.userImage,
            moreUsers : {
                type : 'GET',
                url  : 'http://localhost:2020'
            }
        }
        res.status(200).json(response)
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
     res.status(200).json({
        _id : result._id,
        message : "Updated",
        moreUsers : {
            type : 'GET',
            url : 'http://localhost:2020/users'
        }
     })
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
        res.status(200).json({
            id: doc._id,
            message : "User deleted"
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json(err)
    })
}) 

module.exports = router;