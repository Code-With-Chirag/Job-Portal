import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCompanies } from '@/redux/companySlice';
import axios from 'axios';
import {  COMPANY_API_END_POINT } from '@/utils/constant';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/user`, {
          withCredentials: true, // Ensure credentials are sent if needed
        });
        
        console.log('Fetched Companies:', res.data);
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;

