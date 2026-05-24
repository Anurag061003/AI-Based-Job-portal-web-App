import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated ! Please Login first.",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        };
        req.id = decode.userId;
        req.role = decode.role;
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;