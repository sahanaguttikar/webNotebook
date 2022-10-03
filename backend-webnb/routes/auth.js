const express = require('express');
const User = require('../mongoosemodels/User');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "SAHANASURESH@302"
var fetchuser = require('../mongoosemodels/middleware/fetchuser');

//create-user:post '/api/auth/createuser-no login
router.post(
    "/createuser",
    [
        body("name", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        body("email", "Please enter a valid email").isEmail(),
        body("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        let success=false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success,
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                expiresIn: 10000
            },
                (err, token) => {
                    if (err) throw err;
                    success=true;
                    res.status(200).json({success,
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

// router.post('/createuser', [
//     body('name', 'Enter a valid name').isLength({ min: 3 }),
//     body('email', 'enter a valid email').isEmail(),
//     body('password', 'You should enter a valid password of 5 charecters').isLength({ min: 5 })
// ], async (req, res) => {
//     //if error
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     //user with same email
//     try {
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             return res.status(400).json({ error: "sorry this email already exists.Please try to login with another valid email" })
//         }
//         const salt=await bcrypt.genSalt(10);
//         const secPass=await bcrypt.hash(req.body.password,salt);

//         await user.save();

//         //create user- new
//         user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//         })
//         //.then(user => res.json(user))
//         //.catch(err=>{console.log(err)
//         // res.json({error:'please enter a unique value for email',message:err.msg})})
//         const data={
//             user:{
//                 id:user.id
//             }
//         }
//         const authtoken=jwt.sign(data,JWT_SECRET)       
//         res.json({authtoken});
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Some error has occured");
//     }

// });

//authenticate a user /api/auth/login-no login needed
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()    

], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;



    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "sorry please login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false;
            return res.status(400).json({ success,error: "sorry please login with correct credentials" });
        }
        const payLoad = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(payLoad, JWT_SECRET);
        success=true;
        res.json({ success,authtoken });


    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error has occured");


    }
})

//get user details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error has occured");
    }
});

module.exports = router;