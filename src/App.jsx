import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup.jsx';
import Login from './pages/Login.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import Dashboard from './pages/dashboard.jsx';
import CreateNote from './pages/createNote.jsx';


function App() {


  const router = createBrowserRouter([
    {
      path: '/signup',
      element: <Signup/>
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/forget-password',
      element: <ForgetPassword/>
    },
    {
      path: '/',
      element: <Dashboard/>
    },
    {
      path: '/create-note',
      element: <CreateNote/>
    }
  ])

  return <RouterProvider router={router} />
}

export default App
