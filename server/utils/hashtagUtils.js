import {
    HASHTAG_LIMIT,
    HASHTAG_REGEX,
    HASHTAG_ALLOWED_REGEX,
    INVALID_HASHTAGS_ERROR_CODE,
} from './constants.js';

export const sanitizeTag = (rawTag) => {
    if (typeof rawTag !== 'string') {
        return null;
    }

    const cleaned = rawTag.trim().replace(/^#/, '').toLowerCase();
    if (!HASHTAG_ALLOWED_REGEX.test(cleaned)) {
        return null;
    }

    return cleaned;
};

export const extractHashtagsFromText = (text) => {
    if (!text) {
        return [];
    }

    const tags = [];
    for (const match of text.matchAll(HASHTAG_REGEX)) {
        tags.push(match[2]);
    }

    return tags;
};

export const collectPostHashtags = ({ hashtags, title, description }) => {
    const normalizedSet = new Set();

    if (Array.isArray(hashtags)) {
        for (const tag of hashtags) {
            const sanitizedTag = sanitizeTag(tag);
            if (sanitizedTag) {
                normalizedSet.add(sanitizedTag);
            }
        }
    }

    const textHashtags = extractHashtagsFromText(`${title || ''} ${description || ''}`);
    for (const tag of textHashtags) {
        const sanitizedTag = sanitizeTag(tag);
        if (sanitizedTag) {
            normalizedSet.add(sanitizedTag);
        }
    }

    return Array.from(normalizedSet).slice(0, HASHTAG_LIMIT);
};

export const savePostHashtags = async (client, postId, hashtags) => {
    if (hashtags.length === 0) {
        return [];
    }

    const existingHashtagsResult = await client.query(
        `SELECT id, tag_text, category
         FROM hashtags
         WHERE tag_text = ANY($1::text[])`,
        [hashtags]
    );

    const existingTagMap = new Map(
        existingHashtagsResult.rows.map((tag) => [tag.tag_text, tag])
    );

    const missingTags = hashtags.filter((tag) => !existingTagMap.has(tag));
    if (missingTags.length > 0) {
        const error = new Error('Unknown hashtags provided');
        error.code = INVALID_HASHTAGS_ERROR_CODE;
        error.missingTags = missingTags;
        throw error;
    }

    const savedHashtags = [];

    for (const tagText of hashtags) {
        const hashtag = existingTagMap.get(tagText);

        await client.query(
            `INSERT INTO post_hashtags (post_id, hashtag_id)
             VALUES ($1, $2)
             ON CONFLICT (post_id, hashtag_id) DO NOTHING`,
            [postId, hashtag.id]
        );

        savedHashtags.push(hashtag);
    }

    return savedHashtags;
};
