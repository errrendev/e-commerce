import jwt from 'jsonwebtoken'

const adminAuth = (req,res,next)=>{
    try {
        const {token} = req.headers
        if(!token){
            return res.json({success:false, message:"Unauthorized user"})
        }
        const decoded = jwt.decode(token)
        const email = decoded.email
        const password = decoded.password
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.json({success:false, message:"Unauthorized user"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default adminAuth