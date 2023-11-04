import React from "react";
import { useRoutes } from "react-router-dom";

const App = () => {
    let element = useRoutes([

    ])


    return (
        <div className="app">
            {element}
        </div>
    )
}

export default App;