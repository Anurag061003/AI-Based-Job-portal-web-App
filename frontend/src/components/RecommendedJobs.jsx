import { useSelector } from 'react-redux'
import Job from './Job'

const RecommendedJobs = () => {

 const {recommendedJobs} = useSelector(store=>store.job)
  if (!recommendedJobs || recommendedJobs.length === 0) return null

 return (
  <div className='max-w-7xl mx-auto my-20'>

   <h1 className='text-3xl font-bold mb-5'>
     ⭐ Recommended Jobs
   </h1>

   <div className='grid md:grid-cols-3 gap-4'>
     {
       recommendedJobs?.slice(0,6).map(job=>(
         <Job key={job._id} job={job}/>
       ))
     }
   </div>

  </div>
 )
}

export default RecommendedJobs