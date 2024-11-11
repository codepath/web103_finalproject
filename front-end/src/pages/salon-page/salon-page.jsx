import "../../css/salon-page.css";
import { useParams } from 'react-router-dom';
import salons from "../../data/salons"
import { useEffect, useState } from "react";

const SalonPage = () => {
    let { id } = useParams();
    const [salon, setSalon] = useState();

    useEffect(() => {
        console.log("ID: " + id);
        let salonToFind = salons.filter((salon) => salon.id === id);
        setSalon(salonToFind);
        console.log(salons);
        console.log(salonToFind);
    }, [])

    return (
        <> 
            <div className="salon-page-salon-details">
                <h1>{id}</h1>
            </div>
        </>
    )

}

export default SalonPage;