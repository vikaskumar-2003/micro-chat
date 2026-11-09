import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { TryCatch } from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/user.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);

  if (rateLimit) {
    res.status(429).json({
      message: "Too many requests.Please wait before request new otp",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, otp, { EX: 300 });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "your otp code",
    body: `Your OTP is ${otp} It is valid for 5 minutes `,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "send to your mail",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp: enteredOtp } = req.body;

  console.log(email, enteredOtp);

  if (!email || !enteredOtp) {
    return res.status(400).json({
      message: "Email and Otp Required",
    });
  }

  const otpKey = `otp:${email}`;

  const storedOtp = await redisClient.get(otpKey);
  console.log("sotorr", storedOtp);

  console.log("Email:", email);
  console.log("Stored OTP:", storedOtp);
  console.log("Entered OTP:", enteredOtp);
  console.log("Stored OTP type:", typeof storedOtp);
  console.log("Entered OTP type:", typeof enteredOtp);

  if (!storedOtp || storedOtp !== enteredOtp) {
    return res.status(400).json({
      message: "inavlid or expired OTP",
    });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  const token = generateToken(user);
 console.log(user,"log by log");
 
  res.json({
    message: "user verified",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req?.user?._id);

  if (!user) {
    return res.status(404).json({
      message: "pkease login",
    });
  }

  user.name = req.body.name;

  await user.save();

  const token = generateToken(user);

  res.json({
    message: "user updated",
    user,
    token,
  });
});

export const getAllUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.find({});

  return res.json({
    user,
    message: "all user fetched",
  });
});

export const getUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.params?.id);
console.log("user",user);



  
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
  

  res.json(user)

});
