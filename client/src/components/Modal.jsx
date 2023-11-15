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

import { AiOutlineCloseCircle } from 'react-icons/ai'; // Importing an icon from react-icons

const Modal = ({ movie, onClose }) => {
  if (!movie) return null; // Do not render if no movie is provided

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>
          <AiOutlineCloseCircle size={28} />
        </button>
        <h2 className="modal-title">{movie.title}</h2>
        <p className="modal-description">{movie.description}</p>
        {/* ... Add other movie details you want to display */}
        <a href={movie.trailer_url} className="modal-trailer">Watch Trailer</a>
      </div>
    </div>
  );
}

export default Modal;
