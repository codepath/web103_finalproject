import {useState, useEffect} from 'react'
import Card from '../components/Card'
import PostData from '../data/post.js'

const AllPosts = () => {

    const [posts, setPosts] = useState([])

    useEffect(() => {
        // (async () => {
        //     try{
        //         const data = await api.getAllPosts()
        //         setPosts(data)
        //     } catch(error){
        //         throw error
        //     }
        // }) ()
        setPosts(PostData)
    }, [])

    return (
        <div className='postGrid'>
            {
                posts && posts.length > 0 ? posts.map((post) => 
                    <Card post = {post} />
            ) : <h3>{'No posts found.... '}</h3>
            }
        </div>
    )
}

export default AllPosts