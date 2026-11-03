import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const jwt_secret = process.env.JWT_KEY;
export const generateToken = (user) => {
    return jwt.sign({ user }, jwt_secret, { expiresIn: "15d" });
};
//# sourceMappingURL=generateToken.js.map