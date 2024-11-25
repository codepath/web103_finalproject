import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SalonBox = ({ salonToDisplay }) => {
    // console.log(salon);
    const navigate = useNavigate();
    const [salons, setSalons] = useState([]);
    setSalons(salonToDisplay);

    useEffect(() => {
        if (salonToDisplay) {
            setSalons(salonToDisplay);
        }
    }, [salonToDisplay]);

    return (
        <div className="hps-list-of-salon">
            {salons && salons.length > 0 ? (
                salons.map((salon, index) => (
                    <div className="salon-box" key={index} onClick={() => navigate(`/salon/${salon.id}`)}>
                        <h3 className="sb-salon-name">{salon.name}</h3>
                        <p>&#xf041; {salon.address}, {salon.city}, {salon.state} {salon.zip_code}</p>
                    </div>
                ))
            ) : (
                <p>No salons available to display</p>
            )}

        </div>
    )

}

export default SalonBox;