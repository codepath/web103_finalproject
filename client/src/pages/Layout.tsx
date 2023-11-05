import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <NavBar />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default Layout
