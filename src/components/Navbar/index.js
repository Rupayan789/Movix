import React from 'react'

const Navbar = () => {
  return (
    <header className="w-full md:w-1/2 mx-auto pt-4">
    <nav className="flex justify-between items-center">
      <h1 className="bg-regal-blue bg-clip-text text-transparent flex-1  font-bold  text-5xl text-white text-lg">
        Movix
      </h1>
      <aside className="w-1/3 flex justify-between items-center bg-gray-800 shadow-lg py-1 px-2">
        <input
          className=" text-gray-400 w-full bg-gray-800 py-1 px-2 focus:outline-none"
          placeholder="Search"
          type="text"
          onChange={handleSearch}
        />
        <BiSearch color="#b3cdd1" />
      </aside>
      <aside className="ml-4 bg-gray-800 p-2 ">
        <BiLogOut color="#b3cdd1" size={25} />
      </aside>
    </nav>
  </header>
  )
}

export default Navbar