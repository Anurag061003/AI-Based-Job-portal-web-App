import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse?.secure_url || ""
            }
        });
       const message = `Dear ${fullname},

🎉 Welcome to ApplyNow!

Your account has been successfully created on the ApplyNow Job Portal.

You can now:
✔ Explore thousands of job opportunities
✔ Apply to companies that match your skills
✔ Track your job applications in real-time
✔ Get notified when recruiters respond

🚀 Next Step:
Log in to your account and start applying for jobs that match your career goals.

If you have any questions or need help, feel free to reach out to our support team.

We wish you the best of luck in your job search!

Best Regards,
Team ApplyNow
`;
        await sendEmail(email, "Account Created Successfully", message);
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export async function sendOTPforSignup(req, res) {
    try {
        let otp = Math.floor(Math.random() * 9000) + 1000
     let msg = `Hi ${req.body.email},

Welcome to ApplyNow! 🎉

To complete your signup, please use the following OTP:

🟢 Your OTP: ${otp}

Steps to verify your account:
1️⃣ Copy the OTP above  
2️⃣ Go back to the signup page  
3️⃣ Enter the OTP to verify your email

⏰ Note: This OTP is valid for 5 minutes only.

If you didn’t request this, ignore this email.

Cheers,
Team ApplyNow
`;
       await sendEmail(
            req.body.email,
            "Regarding OTP for your Account Creation on ApplyNow",
            msg
        );
         res.status(200).json({
            success: true,
            otp: otp
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({ success: false, message: "Something went wrong!" })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id,
            role: user.role
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname} !`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        if (skills) {
            user.profile.skills = skills.split(",");
        }

        if (req.file) {
            const fileUri = getDataUri(req.file);

            const cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                { resource_type: "raw",
                    folder: "resumes"
                 }
            );
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = req.file.originalname;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        });
    }
};
