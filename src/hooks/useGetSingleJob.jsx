import { setAllJobs, setSingleJob } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetSingleJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    // useEffect(()=>{
    //     const fetchSingleJobs = async () => {
    //         try {
    //             const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
    //             if(res.data.success){
    //                 dispatch(setSingleJob(res.data.jobs));
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     fetchSingleJobs();
    // },[])
}

export default useGetSingleJobs