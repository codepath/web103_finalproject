import Navbar from "../components/Navbar"
import "../styles/Home.css"
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = (props) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        setBooks(props.data)
    }, [props])

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };
    return (
        <>
            <h1>🔥Welcome to ReadRave🔥</h1>
            <h2>📚share your reading raves with the world📚</h2>

            <div className="carousel-container">
                <div className="review">
                    <p>"I've been using ReadRave for a few months now, and I can't recommend it enough to fellow book enthusiasts." </p>
                    <p>- ReadRaver 1</p>
                </div>
                <div className="carousel">
                    <Carousel
                        responsive={responsive}
                        autoPlay={true}
                        autoPlaySpeed={3000} // Change slide every 3 seconds
                        infinite={true}
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                        {books.map((book, index) => (
                            <div key={index} className="carousel-image">
                                <img src={book.image} alt={`Book ${index + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="review">
                    <p>"ReadRave is a fantastic platform for book lovers. I've enjoyed using it to connect with like-minded readers, and explore new book recommendations." </p>
                    <p>- ReadRaver 2</p>
                </div>
            </div>
        </>
    )
}

export default Home