import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'
import RecommendedJobs from './RecommendedJobs'
import useGetRecommendedJobs from '@/hooks/useGetRecommendedJobs'

const Home = () => {

  useGetAllJobs();
  useGetRecommendedJobs();

  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    // reset search/filter
    dispatch(setSearchedQuery(""));

    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }

  }, [dispatch, navigate, user]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      {user?.role === "student" && <RecommendedJobs />}
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home