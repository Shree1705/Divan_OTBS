import React from 'react'
import { useDispatch, useSelector } from "react-redux";
function AdminProfile() {
  const { user } = useSelector((state) => state.users);
  return (
    <>
      <div className='m-4 bg-info rounded p-4'>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </>

  )
}

export default AdminProfile