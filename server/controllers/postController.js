import { pool } from "../config/database.js";
import {
    COMMENT_CONTENT_MAX_LENGTH,
    COMMENTS_DEFAULT_LIMIT,
    COMMENTS_MAX_LIMIT,
    HASHTAG_SEARCH_DEFAULT_LIMIT,
    HASHTAG_SEARCH_MAX_LIMIT,
    INVALID_HASHTAGS_ERROR_CODE,
    POSTS_DEFAULT_LIMIT,
    POSTS_MAX_LIMIT,
} from "../utils/constants.js";
import {
    collectPostHashtags,
    savePostHashtags,
} from "../utils/hashtagUtils.js";

const getAllPosts = async (req, res) => {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const limit = Number.isNaN(parsedLimit)
        ? POSTS_DEFAULT_LIMIT
        : Math.min(Math.max(parsedLimit, 1), POSTS_MAX_LIMIT);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);

    try {
        const posts = await pool.query(
            `SELECT *
             FROM posts
             ORDER BY created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const totalCountResult = await pool.query(
            `SELECT COUNT(*)::int AS total_count
             FROM posts`
        );

        const totalCount = totalCountResult.rows[0].total_count;
        const hasMore = offset + posts.rows.length < totalCount;

        res.status(200).json({
            posts: posts.rows,
            pagination: {
                totalCount,
                limit,
                offset,
                hasMore,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
}

const createPost = async (req, res) => {
    const userId = req.user.id;
    const {title, description, media_url, link, likes_count, hashtags} = req.body;
    const normalizedHashtags = collectPostHashtags({ hashtags, title, description });
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const userProfile = await client.query(`SELECT id from profiles WHERE user_id = $1`, [userId]);
        if (userProfile.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Profile not found for user' });
        }

        const profileId = userProfile.rows[0].id;
        const newPost = await client.query(
            `INSERT INTO posts (profile_id, title, description, media_url, link, likes_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [profileId, title, description, media_url, link, likes_count]
        );

        const savedHashtags = await savePostHashtags(client, newPost.rows[0].id, normalizedHashtags);

        await client.query('COMMIT');
        res.status(201).json({
            ...newPost.rows[0],
            hashtags: savedHashtags,
        });
    }
    catch (err) {
        await client.query('ROLLBACK');

        if (err.code === INVALID_HASHTAGS_ERROR_CODE) {
            return res.status(400).json({
                message: 'Some hashtags are not in the preset list',
                invalidHashtags: err.missingTags,
            });
        }

        res.status(500).json({ message: 'Error creating post', error: err.message });    
    }
    finally {
        client.release();
    }

}

const deletePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
    }
    try {
        const userProfile = await pool.query(`SELECT id from profiles WHERE user_id = $1`, [userId]);
        if (userProfile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found for user' });
        }
        const profileId = userProfile.rows[0].id;
        const deletedPost = await pool.query(`DELETE FROM posts WHERE id = $1 AND profile_id = $2 RETURNING *`, [postId, profileId]);
        if (deletedPost.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        res.status(200).json({ message: 'Post deleted successfully', post: deletedPost.rows[0] });
    }
    catch (err) {
        res.status(409).json({ message: 'Error deleting post', error: err.message });
    }
}

const addComment = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const {content} = req.body;

    const normalizedContent = typeof content === 'string' ? content.trim() : '';
    if (!normalizedContent) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    if (normalizedContent.length > COMMENT_CONTENT_MAX_LENGTH) {
        return res.status(400).json({ message: `Comment content must be ${COMMENT_CONTENT_MAX_LENGTH} characters or fewer` });
    }

    try {
        const post = await pool.query(`SELECT id FROM posts WHERE id = $1`, [postId]);
        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userProfile = await pool.query(`SELECT id from profiles WHERE user_id = $1`, [userId]);
        if (userProfile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found for user' });
        }

        const profileId = userProfile.rows[0].id;
        const newComment = await pool.query(
            `INSERT INTO comments (post_id, profile_id, content)
             VALUES ($1, $2, $3)
             RETURNING id, post_id, profile_id, content, created_at`,
            [postId, profileId, normalizedContent]
        );

        const comment = newComment.rows[0];
        const author = await pool.query(
            `SELECT p.id AS profile_id, u.username, u.avatar_url
             FROM profiles p
             LEFT JOIN users u ON p.user_id = u.id
             WHERE p.id = $1`,
            [comment.profile_id]
        );

        res.status(201).json({
            ...comment,
            author: {
                profile_id: author.rows[0]?.profile_id || comment.profile_id,
                username: author.rows[0]?.username || null,
                avatar_url: author.rows[0]?.avatar_url || null,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error adding comment', error: err.message });
    }
}

const getPostComments = async (req, res) => {
    const postId = req.params.id;
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const limit = Number.isNaN(parsedLimit)
        ? COMMENTS_DEFAULT_LIMIT
        : Math.min(Math.max(parsedLimit, 1), COMMENTS_MAX_LIMIT);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);

    try {
        const post = await pool.query(`SELECT id FROM posts WHERE id = $1`, [postId]);
        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await pool.query(
            `SELECT c.id,
                    c.post_id,
                    c.profile_id,
                    c.content,
                    c.created_at,
                    u.username,
                    u.avatar_url
             FROM comments c
             JOIN profiles p ON c.profile_id = p.id
             LEFT JOIN users u ON p.user_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at DESC
             LIMIT $2 OFFSET $3`,
            [postId, limit, offset]
        );

        const totalCountResult = await pool.query(
            `SELECT COUNT(*)::int AS total_count
             FROM comments
             WHERE post_id = $1`,
            [postId]
        );

        const totalCount = totalCountResult.rows[0].total_count;
        const hasMore = offset + comments.rows.length < totalCount;

        res.status(200).json({
            comments: comments.rows,
            pagination: {
                totalCount,
                limit,
                offset,
                hasMore,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
}

const searchHashtags = async (req, res) => {
    const query = (req.query.query || '').trim().toLowerCase();
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(parsedLimit)
        ? HASHTAG_SEARCH_DEFAULT_LIMIT
        : Math.min(Math.max(parsedLimit, 1), HASHTAG_SEARCH_MAX_LIMIT);

    if (!query) {
        return res.status(200).json([]);
    }

    try {
        const hashtagResults = await pool.query(
            `SELECT id, tag_text, category
             FROM hashtags
             WHERE tag_text ILIKE $1
             ORDER BY
                CASE WHEN tag_text LIKE $2 THEN 0 ELSE 1 END,
                LENGTH(tag_text),
                tag_text
             LIMIT $3`,
            [`%${query}%`, `${query}%`, limit]
        );

        res.status(200).json(hashtagResults.rows);
    }
    catch (err) {
        res.status(500).json({ message: 'Error searching hashtags', error: err.message });
    }
}

export default {
    getAllPosts,
    createPost,
    deletePost,
    addComment,
    getPostComments,
    searchHashtags
}