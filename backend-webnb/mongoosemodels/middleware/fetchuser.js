var jwt = require('jsonwebtoken');
const JWT_SECRET="SAHANASURESH@302"

const fetchuser=(req,res,next)=>{
    //get user from jwt-token
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please authenticate a valid user id"});
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next();
        
    } catch (error) {
        console.error(error.message);
        res.status(401).send({error:"Some error has occured"});
        
    }
    

}
module.exports=fetchuser;