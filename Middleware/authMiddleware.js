
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req,res,next)=>{
    try{
        const Token = req.cookies.perkyBeansToken;
        const verifyToken = jwt.verify(Token,SECRET_KEY);
        const rootUser = await UserModel.findOne({_id:verifyToken._id,"Tokens.Token":Token});
        if(!rootUser){
            throw new Error("User Not Found");
        }
        req.Token = Token;
        req.rootUser = rootUser;
        req.userID = rootUser._id; 
        next();
    }catch(err){
        console.log("Authenication Error User is Not Logged-in");
        res.status(401).send({message:"Unauthorized:No token provided",msg2:"Please Login Before Adding to Bag"});
    }
}

module.exports = authMiddleware;