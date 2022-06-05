import React from 'react'
import NotFound  from '../../assets/NotFound.svg'
const NoResource = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
        <h1 className="text-5xl font-bold text-center mt-12 text-white">404</h1>
        <h1 className="text-xl font-bold text-center mt-1 text-white">Not Found</h1>
        <img className="w-full md:w-3/5 mx-auto" src={NotFound} alt="Not-found"/>
    </div>
  )
}

export default NoResource