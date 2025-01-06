import React from 'react'
import Navbar from './Shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import RecruiterHome from './RecruiterHome'
import AdminHome from './AdminHome'
import RetroGrid from './RetroGrid'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);

  if (user?.role === 'Recruiter') {
    return (
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className="flex-grow">
          <RecruiterHome />
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.role === 'Admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AdminHome />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <RetroGrid className="fixed inset-0 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <CategoryCarousel />
          <LatestJobs />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home
