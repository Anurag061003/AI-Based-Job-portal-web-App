import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [loadingOTP, setLoadingOTP] = useState(false);
    const [otpSend, setOtpSend] = useState("");
    const [otpEntered, setOtpEntered] = useState("");
    const [showOTPContent, setShowOTPContent] = useState(false);
    const [showSuccessOTPmessage, setShowSuccessOTPmessage] = useState(false);
    const [showFailedOTPmessage, setShowFailedOTPmessage] = useState(false);
    const [disableSignupButton, setDisableSignupButton] = useState(true);
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    const sendOTP = async () => {
    if (!input.email) {
        toast.error("Please enter email first");
        return;
    }

    try {
        setLoadingOTP(true);

        const res = await axios.post(
            `${USER_API_END_POINT}/send/otp/for/signup`,
            { email: input.email }
        );

        if (res.data.success) {
            setOtpSend(res.data.otp);
            setShowOTPContent(true);
            setLoadingOTP(false)
        }

    } catch (error) {
        console.log(error);
    } finally {
        setLoadingOTP(false);
    }
};

    const verifyOTP = () => {

        if (parseInt(otpSend) === parseInt(otpEntered)) {
            setShowSuccessOTPmessage(true);
            setShowFailedOTPmessage(false);
            setShowOTPContent(false);
            setDisableSignupButton(false);

        } else {
            setShowFailedOTPmessage(true);
            setShowSuccessOTPmessage(false);
        }
    };
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-6xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter Your name"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>

                        <div className='flex gap-2'>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                               disabled={showOTPContent || showSuccessOTPmessage}
                            />

                            {!showOTPContent && !showSuccessOTPmessage && (
                                <Button type="button" onClick={sendOTP} disabled={loadingOTP}>
                                    {loadingOTP ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Sending OTP
                                        </>
                                    ) : "Verify Email"}
                                </Button>
                            )}
                        </div>
                    </div>
                    {
                        showOTPContent && (
                            <div className='my-2'>
                                <p className='text-green-600 text-sm font-semibold'>
                                    OTP has been sent to your email !
                                </p>

                                <Label>Enter OTP</Label>

                                <div className='flex gap-2'>
                                    <Input
                                        type="number"
                                        placeholder="Enter OTP"
                                        onChange={(e) => setOtpEntered(e.target.value)}
                                    />

                                    <Button type="button" onClick={verifyOTP}>
                                        Verify OTP
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                    {
                        showSuccessOTPmessage && (
                            <p className='text-green-600 text-sm font-semibold'>
                                ✅ OTP verified successfully !
                            </p>
                        )
                    }

                    {
                        showFailedOTPmessage && (
                            <p className='text-red-500 text-sm font-semibold'>
                                ❌ Incorrect OTP, please try again .
                            </p>
                        )
                    }
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder=""
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Set password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-4">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={disableSignupButton}
                                className="w-full my-4"
                            >
                                Signup
                            </Button>
                        )
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup