import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { BiSolidCameraMovie } from "react-icons/bi";

const Timeline = ({ movies, onMovieSelect }) => {
    // Sort movies by publish_date in descending order
    const sortedMovies = [...movies].sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));

    // Create a timeline element for each movie
    const timelineElements = sortedMovies.map(movie => (
        <VerticalTimelineElement
            key={movie.movie_id}
            className="vertical-timeline-element--movie"
            date={movie.publish_date.split('T')[0]}
            iconStyle={{ background: 'rgb(100, 2, 12)', color: '#fff' }}
            icon={<BiSolidCameraMovie />}
            onTimelineElementClick={() => onMovieSelect(movie)}
            contentArrowStyle={
                {
                    backgroundColor: 'rgb(100, 2, 12)',
                    border: 'none',
                }
            }
            contentStyle={
                {
                    backgroundImage: `url(${movie.img_url})`,
                    backgroundSize: 'cover',
                    backgroundPositionX: 'center',
                    backgroundPositionY: '10%',
                    color: 'white',
                    boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    cursor: 'pointer'
                }
            }
        >
            <h3 className='card-title'>{movie.title}</h3>
            <a href={movie.trailer_url} className='card-trailer' target='_blank' style={{ marginTop: '150px' }}>Watch Trailer</a>
        </VerticalTimelineElement>
    ));

    return (
        <div className="timeline-container">
            <VerticalTimeline
                lineColor={'grey'}
            >
                {timelineElements}
            </VerticalTimeline>
        </div>
    );
};

export default Timeline;
