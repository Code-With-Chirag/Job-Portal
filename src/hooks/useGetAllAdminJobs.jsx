import { setAllAdminJobs } from '@/redux/jobSlice'
import { ADMIN_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.jobs) {
                    console.log('Fetched Jobs:', res.data);
                    dispatch(setAllAdminJobs(res.data.jobs)); 
                    console.log('Jobs fetched and dispatched:', res.data.jobs);
                } else {
                    console.error('Unexpected response format:', res.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllAdminJobs();
    }, [dispatch])

    return loading;
}

export default useGetAllAdminJobs

