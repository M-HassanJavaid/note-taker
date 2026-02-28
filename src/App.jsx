import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import Dashboard from './pages/dashboard';
import CreateNote from './pages/createNote';


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
