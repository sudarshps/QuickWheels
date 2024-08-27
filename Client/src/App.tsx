import './App.css'
import Home from './pages/Home/Home.tsx'
import Login from './pages/Login/Login.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return(
    <Router>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
