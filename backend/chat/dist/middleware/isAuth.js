import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                message: "Please Login no header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        if (!decode || !decode.user) {
            res.status(400).json({
                message: "Please Login no header",
            });
            return;
        }
        req.user = decode.user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "pleaase login -jwt error"
        });
    }
};
//# sourceMappingURL=isAuth.js.map