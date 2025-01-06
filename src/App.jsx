import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Navbar from "./components/Shared/Navbar"
import LogIn from './components/auth/LogIn'
import SignUp from './components/auth/SignUp'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/Recruiter/Companies'
import CompanyCreate from './components/Recruiter/CompanyCreate'
import CompanySetup from './components/Recruiter/CompanySetup'
import AdminJobs from './components/Recruiter/AdminJobs'
import PostJob from './components/Recruiter/PostJob'
import Applicants from './components/Recruiter/Applicants'
import ProtectedRoute from './components/Recruiter/ProtectedRoute'
import JobUpdate from './components/Recruiter/JobUpdate'
import AdminDashboard from './components/AdminDashboard'
import AdminProtectedRoute from './components/Recruiter/AdminProtectedRoute'
import ViewProfile from './components/ViewProfile'
import AdminHome from './components/AdminHome'
import AdminProfile from './components/AdminProfile'
import AppliedJobTable from './components/AppliedJobTable'
import AppliedJobsPage from './components/AppliedJobsPage'
// import CompanyDelete from './components/Recruiter/CompanyDelete'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/LogIn',
    element: <LogIn />
  },
  {
    path: '/SignUp',
    element: <SignUp />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/appliedjobs',
    element: <AppliedJobsPage />
  },
  {
    path: '/view-profile',
    element: <ViewProfile />
  },

  //for admin and dashboard
  {
    path: '/admin/dashboard',
    element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
  },
  {
    path: '/',
    element: <AdminProtectedRoute><AdminHome /></AdminProtectedRoute>
  },
  {
    path: "/admin/profile",
    element: <><AdminProfile /></>
  },
  //from here it will start for recruiter functionalities
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:jobId/jobupdate",
    element: <ProtectedRoute><JobUpdate /></ProtectedRoute>
  }




])
function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App
