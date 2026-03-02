import React, { useContext } from 'react'
import authContext from '../context/authContext'
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const { user , setUser } = useContext(authContext);

    if (!user) {
        return <Navigate to='/login' />
    }

    if (!user.isVerified) {
      return <Navigate to='/verify-email' />
    }

  return children
}

export default ProtectedRoute