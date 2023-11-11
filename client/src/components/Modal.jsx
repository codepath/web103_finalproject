import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaInstagram, FaTwitter, FaEdit, FaTimes } from 'react-icons/fa';

import styles from './Modal.module.css';

const Modal = ({ creator, closeModal }) => {
    const { id, name, image_url, description, instagram, twitter, youtube } = creator;

    return (
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>
                <button className={styles.close} onClick={closeModal}><FaTimes /></button>
                <h2>{name}</h2>
                {/* Rest of the information you want to display */}
                <img className={styles.image} src={image_url} alt={name} />
                <p className={styles.description}>{description}</p>

                <div className={styles["bottom-icons"]}>
                    <div className={styles.socials}>
                        {youtube && (
                            <li>
                                <a href={'https://www.youtube.com/' + youtube} target='_blank' rel='noreferrer'>
                                    <FaYoutube className={styles.icon} /> @{youtube}
                                </a>
                            </li>
                        )}
                        {instagram && (
                            <li>
                                <a href={'https://www.instagram.com/' + instagram} target='_blank' rel='noreferrer'>
                                    <FaInstagram className={styles.icon} /> @{instagram}
                                </a>
                            </li>
                        )}
                        {twitter && (
                            <li>
                                <a href={'https://www.twitter.com/' + twitter} target='_blank' rel='noreferrer'>
                                    <FaTwitter className={styles.icon} /> @{twitter}
                                </a>
                            </li>
                        )}
                    </div>

                    <div className={styles["action-icons"]}>
                        <span>Wanna edit this creator?</span>
                        <Link to={'/edit/' + id} className={styles.icon}>
                            <FaEdit />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
