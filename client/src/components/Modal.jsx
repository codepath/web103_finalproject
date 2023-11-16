// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaYoutube, FaInstagram, FaTwitter, FaEdit, FaTimes } from 'react-icons/fa';

// import styles from './Modal.module.css';

// const Modal = ({ creator, closeModal }) => {
//     const { id, name, image_url, description, instagram, twitter, youtube } = creator;

//     return (
//         <div className={styles.modal}>
//             <div className={styles["modal-content"]}>
//                 <button className={styles.close} onClick={closeModal}><FaTimes /></button>
//                 <h2>{name}</h2>
//                 {/* Rest of the information you want to display */}
//                 <img className={styles.image} src={image_url} alt={name} />
//                 <p className={styles.description}>{description}</p>

//                 <div className={styles["bottom-icons"]}>
//                     <div className={styles.socials}>
//                         {youtube && (
//                             <li>
//                                 <a href={'https://www.youtube.com/' + youtube} target='_blank' rel='noreferrer'>
//                                     <FaYoutube className={styles.icon} /> @{youtube}
//                                 </a>
//                             </li>
//                         )}
//                         {instagram && (
//                             <li>
//                                 <a href={'https://www.instagram.com/' + instagram} target='_blank' rel='noreferrer'>
//                                     <FaInstagram className={styles.icon} /> @{instagram}
//                                 </a>
//                             </li>
//                         )}
//                         {twitter && (
//                             <li>
//                                 <a href={'https://www.twitter.com/' + twitter} target='_blank' rel='noreferrer'>
//                                     <FaTwitter className={styles.icon} /> @{twitter}
//                                 </a>
//                             </li>
//                         )}
//                     </div>

//                     <div className={styles["action-icons"]}>
//                         <span>Wanna edit this creator?</span>
//                         <Link to={'/edit/' + id} className={styles.icon}>
//                             <FaEdit />
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Modal;


import React from 'react';
import '../css/Modal.css';
import { AiOutlineCloseCircle, AiFillYoutube } from 'react-icons/ai'; // Importing icons from react-icons
import { FaRegCalendarAlt, FaRegUser, FaUsers, FaEdit } from 'react-icons/fa'; // Additional icons for details

const Modal = ({ movie, onClose }) => {
  if (!movie) return null;

  // Assuming the `trailer_url` is a YouTube link, we extract the video ID for embedding
  const youtubeVideoId = movie.trailer_url.split('v=')[1];

  return (
    <div className="modal-backdrop">
      <div className="modal">

        <button className="modal-close-btn" onClick={onClose}>
          <AiOutlineCloseCircle size={28} />
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{movie.title}</h2>
          {/* <img src={movie.img_url} alt={movie.title} className="modal-image"/> */}
        </div>

        <div className="modal-body">
          <p className="modal-description">{movie.description}</p>
          <div className="modal-info">
            <FaRegUser className="icon" />
            <span>Director: {movie.director}</span>
          </div>
          <div className="modal-info">
            <FaUsers className="icon" />
            <span>Actors: {movie.actors}</span>
          </div>

          <div className="modal-info">
            <FaRegCalendarAlt className="icon" />
            <span>Release Date: {movie.publish_date}</span>
          </div>

        </div>
        <div className="modal-footer">
          <div className="youtube-container">
            <AiFillYoutube className="youtube-icon" />
            <iframe
              className="youtube-iframe"
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Movie Trailer"
            ></iframe>
          </div>

          <div className="modal-edit-link">
            <a href={`/edit/${movie.movie_id}`} className="edit-link">
              <FaEdit className="icon edit-icon" />
              Edit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
