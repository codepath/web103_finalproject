import { useNavigate } from "react-router-dom";

const SalonBox = ({ salon }) => {
    console.log(salon);
    const navigate = useNavigate();

    return (
        <>
            <div className="salon-box">
                <h3 className="sb-salon-name" onClick={() => navigate(`/salon/${salon.id}`)}>{salon.name}</h3>
                <p>&#xf041; {salon.address}, {salon.city}, {salon.state} {salon.zip_code}</p>
            </div>
        </>
    )

}

export default SalonBox;