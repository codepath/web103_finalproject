import { useEffect, useState } from "react";
import "../../css/home-page.css";
// import SalonBox from "./salon-box";
import { getAllSalons } from "../../services/salonAPI";
import { useNavigate } from "react-router-dom";
import PlaceIcon from '@mui/icons-material/Place';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { imageLinks } from "../../data/imageLinks";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const HomePage = () => {
    // const [searchPattern, setSearchPattern] = useState("");
    const [salons, setSalons] = useState([]);
    const [salonToDisplayFilter, setSalonToDisplayFilter] = useState([]); // Filtered list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // const salonImage = "https://www.revealhairstudiorye.com/wp-content/uploads/2021/01/Untitled-design.jpg";

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalons = async () => {
            setLoading(true);
            try {
                const salonList = await getAllSalons();
                // console.log(salonList)
                setSalons(salonList);
                setSalonToDisplayFilter(salonList);
            } catch (err) {
                setError("Failed to fetch salons");
            } finally {
                setLoading(false);
            }
        };

        fetchSalons();
    }, []); // Add empty dependency array to run only on mount


    // console.log(salonToDisplay);

    const onSearch = (searchPattern) => {
        const filteredSalons = salons.filter((s) => 
            s.name.toLowerCase().startsWith(searchPattern.toLowerCase())
        );
        setSalonToDisplayFilter(filteredSalons);
    };

    return (
        <> 
            <div className="home-page-landing">
                <div className="hpl-center-box">
                    <p className="hpl-title">BOOKEZ</p>
                    <h2><i>Effortless Salon Booking at Your Fingertips</i></h2>
                    <div className="home-page-landing-explore-more">
                        <a className="button-light" href="#intro">Explore more</a>
                        <a className="button-info" href="#salon">Salons near me</a>
                    </div>
                </div>
            </div>

            <div className="home-page-introduction" id="intro">
                <div className="home-page-introduction-description">
                    <h3>BOOKEZ is a dynamic platform that suggests a list of salons and allows you to book an appointment for hair and nails with your favorite stylists.</h3>
                    <h3><i>With BOOKEZ, you can</i></h3>
                    <div className="home-page-introduction-description-advantage">
                        {/* <h4>&#9989; Book appointments with ease and precision.</h4> */}
                        <h4 className="advantage"><SecurityUpdateGoodIcon color="#00A9FF" /> Book appointments with ease and precision.</h4>
                        <h4 className="advantage"><NotificationsActiveIcon /> Get automatic reminders and avoid missed appointments.</h4>
                        <h4 className="advantage"><AccessTimeFilledIcon /> Customize for a perfect fit with your business.</h4>
                    </div>
                </div>
                <div className="home-page-introduction-image">
                    <img src="https://socialhousenews.com/wp-content/uploads/2024/03/salonn-850x560.jpeg" alt="salons" />
                </div>
            </div>

            <div className="home-page-salons" id="salon">
                <div className="home-page-salons-header">
                    <div className="hps-header">
                        <h1>List of salons</h1>
                        <h5><i>Choose your favorite salons</i></h5>
                    </div>

                    <div className="hps-search-bar">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="input-box" 
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <h2>Loading salons...</h2>
                ) : error ? (
                    <h2>{error}</h2>
                ) : salons.length === 0 ? (
                    <h2>There is currently no salon to display</h2>
                ) : (
                    <div className="hps-list-of-salon">
                        {salonToDisplayFilter && salonToDisplayFilter.length > 0 ? (
                            salonToDisplayFilter.map((salon, index) => (
                                // <div className="salon-box" key={index} onClick={() => navigate(`/salon/${salon.id}`)}>
                                    <Card sx={{ maxWidth: "max-width" }} className="salon-box" key={index} onClick={() => navigate(`/salon/${salon.id}`)}>
                                        <CardActionArea>
                                            <CardMedia
                                            component="img"
                                            height="140"
                                            image={imageLinks[getRandomInt(imageLinks.length)]}
                                            alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {salon.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <PlaceIcon /> 
                                                    {salon.address}, {salon.city}, {salon.state} {salon.zip_code}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                // </div>
                            ))
                        ) : (
                            <p>No salon match your search</p>
                        )}
                </div>
                )}
            </div>
        </>
    );
};

export default HomePage;
