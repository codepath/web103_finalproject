import React from 'react'
import { Link } from 'react-router-dom'
import './PageNotFound.css'

const PageNotFound = () => { 
    return (
        <div className="PageNotFound">
            <main className="fof-container">
                <div class="fof">
                    <h1>😮 404</h1> <br /> <br />
                    <h6>Page Not Found</h6>  <br /> <br />

                    <Link to="/"><button>Go To Sneakers</button></Link>

                </div>
            </main>
        </div>
    )
}

export default PageNotFound