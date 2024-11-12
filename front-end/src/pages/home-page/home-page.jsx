import { useEffect, useState } from "react";
import "../../css/home-page.css";
// import SalonBox from "./salon-box";
import { getAllSalons } from "../../services/salonAPI";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [searchPattern, setSearchPattern] = useState("");
    const [salonToDisplay, setSalonToDisplay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalons = async () => {
            setLoading(true);
            try {
                const salonList = await getAllSalons();
                // console.log(salonList)
                setSalonToDisplay(salonList);
            } catch (err) {
                setError("Failed to fetch salons");
            } finally {
                setLoading(false);
            }
        };

        fetchSalons();
    }, []); // Add empty dependency array to run only on mount


    // console.log(salonToDisplay);

    const onSearch = () => {
        const filteredSalons = salonToDisplay.filter((s) => 
            s.name.toLowerCase().startsWith(searchPattern.toLowerCase())
        );
        setSalonToDisplay(filteredSalons);
    };

    return (
        <> 
            <div className="home-page-landing">
                <p className="hpl-title">BOOKEZ</p>
                <h2><i>Effortless Salon Booking at Your Fingertips</i></h2>
                <div className="home-page-landing-explore-more">
                    <button className="button-light">Explore more</button>
                    <a className="button-info" href="#salon">Salons near me</a>
                </div>
            </div>

            <div className="home-page-introduction">
                <div className="home-page-introduction-description">
                    <h3>BOOKEZ is a dynamic platform that suggests a list of salons and allows you to book an appointment for hair and nails with your favorite stylists.</h3>
                    <h3><i>With BOOKEZ, you can</i></h3>
                    <div className="home-page-introduction-description-advantage">
                        <h4>&#9989; Book appointments with ease and precision.</h4>
                        <h4>&#9989; Get automatic reminders and avoid missed appointments.</h4>
                        <h4>&#9989; Customize for a perfect fit with your business.</h4>
                    </div>
                </div>
                <div className="home-page-introduction-image">
                    <img src="https://socialhousenews.com/wp-content/uploads/2024/03/salonn-850x560.jpeg" alt="salons" />
                </div>
            </div>

            <div className="home-page-salons" id="salon">
                <div className="home-page-salons-header">
                    <div className="hps-header">
                        <h1>List of Salons</h1>
                        <h5><i>Finding your favorite salons</i></h5>
                    </div>

                    <div className="hps-search-bar">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="input-box" 
                            onChange={(e) => { setSearchPattern(e.target.value); onSearch(); }} 
                        />
                    </div>
                </div>

                {loading ? (
                    <h2>Loading salons...</h2>
                ) : error ? (
                    <h2>{error}</h2>
                ) : salonToDisplay.length === 0 ? (
                    <h2>There is currently no salon to display</h2>
                ) : (
                    <div className="hps-list-of-salon">
                    {salonToDisplay && salonToDisplay.length > 0 ? (
                        salonToDisplay.map((salon, index) => (
                            <div className="salon-box" key={index} onClick={() => navigate(`/salon/${salon.id}`)}>
                                <h3 className="sb-salon-name">{salon.name}</h3>
                                <p>&#xf041; {salon.address}, {salon.city}, {salon.state} {salon.zip_code}</p>
                            </div>
                        ))
                    ) : (
                        <p>No salons available to display</p>
                    )}
                </div>
                )}
            </div>
        </>
    );
};

export default HomePage;
