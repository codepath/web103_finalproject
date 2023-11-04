import Navbar from "../components/Navbar"
import "../styles/Home.css"
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
    const books = [
        // Define your book data here (e.g., book objects with image URLs).
        { imageUrl: "https://d3ui957tjb5bqd.cloudfront.net/uploads/2016/04/Inspiring-Book-Covers-11.jpg" },
        { imageUrl: "https://s3-eu-central-1.amazonaws.com/centaur-wp/designweek/prod/content/uploads/2016/06/27172030/image007-318x500.jpg" },
        { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtyRoS7-VP5xyAlCgJYLsfRzIVw9Gp-wN6MmOmqk5nl1l7URmFcd6p3IMOn-53eHJvUX0&usqp=CAU" },
        { imageUrl: "https://blog.still-water.net/wp-content/uploads/2013/03/random_penguin_death_cure.jpg" },
        { imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF9MhzTzYuWe_kpNvtaTR9D5YPtP2ZoSeVgA&usqp=CAU" },
        { imageUrl: "https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/01/american-psycho.jpg?auto=format&q=60&fit=max&w=930" }
    ];

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
            {/* <Navbar /> */}

            <h1>Welcome to ReadRave!</h1>
            <h2>📚share your reading raves with the world📚</h2>

            <div>
                <h2>Hear some reviews from our readers:</h2>

                <div>
                    <text>"I've been using ReadRave for a few months now, and I can't recommend it enough to fellow book enthusiasts."</text>
                </div>
                <div>
                    {/* <text>PICTURE 1</text> */}
                </div>

                <div>
                    <text>"ReadRave is a fantastic platform for book lovers, and it has a lot of potential. I've enjoyed using it to connect with like-minded readers, and explore new book recommendations"</text>
                </div>
                <div>
                    {/* <text>PICTURE 2</text> */}
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
                            <div key={index}>
                                <img src={book.imageUrl} alt={`Book ${index + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </>
    )
}

export default Home