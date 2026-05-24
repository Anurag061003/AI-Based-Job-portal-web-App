import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
       <div className="text-center">
  <div className="flex flex-col gap-6 my-16">
    
    <span className="mx-auto px-6 py-2 rounded-full 
      bg-gradient-to-r from-purple-100 to-indigo-100 
      text-[#6A38C2] font-semibold tracking-wide shadow-sm">
      🚀 India’s Fastest Growing Job Platform
    </span>

    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
      Find Jobs That <br />
      Match Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
        Passion
      </span>
    </h1>

   <p className="text-gray-500 text-lg max-w-2xl mx-auto">
  Your skills deserve the right platform — start applying to jobs that matter.
</p>


    <div className="flex w-[45%] min-w-[300px] mx-auto 
      shadow-xl border border-gray-200 rounded-full items-center overflow-hidden bg-white">
      
      <input
        type="text"
        placeholder="Search by role, company or location"
        onChange={(e) => setQuery(e.target.value)}
        className="outline-none px-6 py-4 w-full text-gray-700"
      />

      <Button
        onClick={searchJobHandler}
        className="rounded-full px-6 py-4 
        bg-gradient-to-r from-[#6A38C2] to-[#5b2bbd] hover:opacity-90">
        <Search className="h-5 w-5 text-white" />
      </Button>
    </div>

  </div>
</div>

    )
}

export default HeroSection