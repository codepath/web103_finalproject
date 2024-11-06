import React from "react";
import "../css/404.css";

const NotFoundPage = () => {
    return (
        <div className="container">
            <h1>404</h1>
            <p>Oops! The page you are looking for doesn't exist.</p>
            <a href="/">Go Back to Home</a>
        </div>
    );
}

export default NotFoundPage;