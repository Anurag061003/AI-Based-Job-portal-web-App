import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { setRecommendedJobs, setAllAppliedJobs, setAllJobs } from "@/redux/jobSlice";

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setRecommendedJobs([]));
        dispatch(setAllAppliedJobs([]));

        navigate("/");
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);

      dispatch(setUser(null));
      dispatch(setRecommendedJobs([]));
      dispatch(setAllAppliedJobs([]));

      navigate("/");
      toast.success("Logged out successfully");
    }
  };
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Apply
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F83002] to-[#ff6a3d]">
              Now
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-10">

          <ul className="flex font-medium items-center gap-6 text-gray-700">
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li className="hover:text-[#6A38C2] transition-colors">
                    <Link to="/admin/companies">Companies</Link>
                  </li>
                  <li className="hover:text-[#6A38C2] transition-colors">
                    <Link to="/admin/jobs">Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-[#6A38C2] transition-colors">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="hover:text-[#6A38C2] transition-colors">
                    <Link to="/jobs">Jobs</Link>
                  </li>
                  <li className="hover:text-[#6A38C2] transition-colors">
                    <Link to="/browse">Browse</Link>
                  </li>
                </>
              )
            }
          </ul>

          {
            !user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-5">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full px-5 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:opacity-90">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-[#6A38C2]/20 hover:ring-[#6A38C2]/50 transition">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-80 rounded-xl shadow-xl border border-gray-100">
                  <div>
                    <div className="flex gap-3 items-center mb-3">
                      <Avatar>
                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-gray-600">
                      {
                        user && user.role === 'student' && (
                          <div className="flex items-center gap-2 hover:text-[#6A38C2] transition cursor-pointer">
                            <User2 className="h-4 w-4" />
                            <Button variant="link" className="p-0 h-auto">
                              <Link to="/profile">View Profile</Link>
                            </Button>
                          </div>
                        )
                      }

                      <div className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <Button onClick={logoutHandler} variant="link" className="p-0 h-auto">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }
        </div>
      </div>
    </div>

  )
}

export default Navbar