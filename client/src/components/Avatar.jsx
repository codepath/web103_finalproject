import React from 'react'
import '../styles/Avatar.css'

const Avatar = (props) =>  {
    return (
        <div className='Avatar'>
            <img className='user-img' src={props.user.avatarurl} alt='avatar' />
        </div>
    )
}

export default Avatar
