import { setAllUsers } from '@/redux/userSlice'
import { ADMIN_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllUsers = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${ADMIN_API_END_POINT}/users`, { withCredentials: true });
                if (res.data) {
                    dispatch(setAllUsers(res.data));
                    console.log('Users fetched:', res.data);
                } else {
                    console.error('Unexpected response format:', res.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllUsers();
    }, [dispatch])

    return loading;
}

export default useGetAllUsers