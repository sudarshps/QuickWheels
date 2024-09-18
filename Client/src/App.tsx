import './App.css'
import Home from './pages/User/Home/Home.tsx'
import Login from './pages/User/Login/Login.tsx'
import HostStartup from './pages/User/Host Startup/HostStartup.tsx'
import RegisterForm from './pages/User/Host Registration/HostRegister.tsx'
import AdminLogin from './pages/Admin/Login/AdminLogin.tsx'
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard.tsx'
import HostDashboard from './pages/User/Host Dashboard/HostDashboard.tsx'
import UserList from './pages/Admin/User List/UserList.tsx'
import HostList from './pages/Admin/Host List/HostList.tsx'
import Profile from './pages/User/Profile/Profile.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/Protected Route/ProtectedRoute.tsx'
import CarDetails from './pages/User/Car Details/CarDetails.tsx'
import AdminProtectedRoute from './components/Protected Route/adminProtectedRoute.tsx'
import Login2 from './pages/User/Login/Login2.tsx'
import UserVerification from './pages/Admin/User Verification/UserVerification.tsx'


function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/login2' element={<Login2/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path='/becomehost' element={<HostStartup/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/hostregister' element={<RegisterForm/>}/>
        <Route path='/hostdashboard' element={<HostDashboard/>}/>
        <Route path='/editcardetails' element={<CarDetails/>}/>
        </Route>


        <Route path='/admin' element={<AdminLogin/>}/>
        <Route element={<AdminProtectedRoute/>}>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/userlist' element={<UserList/>}/>
        <Route path='/admin/hostlist' element={<HostList/>}/>
        <Route path='/admin/userverification' element={<UserVerification/>}/>
        </Route>     
      </Routes>
    </Router>
  )  
}

export default App
