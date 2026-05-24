import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch ,useSelector} from "react-redux";
import { setRecommendedJobs } from "@/redux/jobSlice";

const useGetRecommendedJobs = () => {

 const dispatch = useDispatch();
 const { user } = useSelector(store => store.auth);  

 useEffect(()=>{
    if(!user) {
       dispatch(setRecommendedJobs([]));
       return;
    }
   const fetchRecommendedJobs = async () => {

     try{
       const res = await axios.get(
         `${JOB_API_END_POINT}/recommended`,
         {withCredentials:true}
       );

       if(res.data.success){
         dispatch(setRecommendedJobs(res.data.jobs))
       }

     }catch(error){
       console.log(error)
     }

   }

   fetchRecommendedJobs();

 },[user])

}

export default useGetRecommendedJobs