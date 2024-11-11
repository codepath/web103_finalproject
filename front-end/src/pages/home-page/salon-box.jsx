

const SalonBox = ({ salon }) => {
    console.log(salon);
    return (
        <>
            <div className="salon-box">
                <h3>{salon.name}</h3>
                {/* <div className="salon-box-address">

                </div> */}
                <p>&#xf041; {salon.address}, {salon.city}, {salon.state} {salon.zip_code}</p>
            </div>
        </>
    )

}

export default SalonBox;