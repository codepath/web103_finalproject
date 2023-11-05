import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

const NavBar = () => {
    return (
        <div className="flex flex-row h-[65px]">
            <Link to="/" className="justify-start p-4">
                <img src="/logo2.png" alt="logo" />
            </Link>
            <div className=" flex w-full justify-center">
                <SearchBar />
            </div>
        </div>
    )
}

export default NavBar
