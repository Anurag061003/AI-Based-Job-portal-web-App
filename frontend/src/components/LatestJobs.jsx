import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const LatestJobs = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
                    Trending
                </span> Job Opportunities
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 
                        ? <span>No Job Available</span> 
                        : allJobs.slice(0,15).map(job => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </div>
    )
}

export default LatestJobs;