import { useEffect, useState } from 'react'
import { createBrowserRouter, data, RouterProvider, useNavigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import Dashboard from './pages/dashboard.jsx';
import CreateNote from './pages/createNote.jsx';
import AuthContext from './context/authContext.js';
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Loader from "./components/Loader.jsx"
import NoteContext from './context/noteContext.js';

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([])

  async function getUser() {
    try {
      console.log(`${import.meta.env.VITE_API_URL}/api/v1/auth/getUser`)
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/getUser`, {
        credentials: 'include'
      });
      let data = await res.json();
      console.log(data)
      if (!data.isLogin) {
        return;
      };
      setUser(data.user)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
  }, []);


  if (loading) {
    return <Loader />
  }

  const router = createBrowserRouter([
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/forget-password',
      element: <ForgetPassword />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/create-note',
      element: (
        <ProtectedRoute>
          <CreateNote />
        </ProtectedRoute>
      )
    }
  ])

  return (
    <AuthContext.Provider value={{ user, setUser }} >
      <NoteContext.Provider value={{ notes, setNotes }}>
        <RouterProvider router={router} />
      </NoteContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
