import React from 'react'

const Spinner =() => {
  return (
    <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 ">
      <img src="/Images/spinnerimg.png" alt="" />
    </div>
  </div>
  )
}

export default Spinner;
