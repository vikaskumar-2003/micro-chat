
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name:process.env.Cloud_Name as string,
    api_key:process.env.API_KEY as string,
    api_secret:process.env.API_SCERET as string
})

export default cloudinary