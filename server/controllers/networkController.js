import { pool } from "../config/database.js";
import networkStatus from "../utils/statusEnum.js";
import {
    NETWORK_DEFAULT_LIMIT,
    NETWORK_MAX_LIMIT,
} from "../utils/constants.js";

const getProfileIdByUserId = async (userId) => {
    const profile = await pool.query(`SELECT id FROM profiles WHERE user_id = $1`, [userId]);
    return profile.rows[0]?.id || null;
};

const getNetworkById = async (networkId) => {
    const result = await pool.query(`SELECT * FROM network WHERE id = $1`, [networkId]);
    return result.rows[0] || null;
};

const getProfileCardByProfileId = async (profileId) => {
    const result = await pool.query(
        `SELECT p.id,
                p.bio,
                p.location,
                p.links,
                u.username,
                u.avatar_url
         FROM profiles p
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`,
        [profileId]
    );

    return result.rows[0] || null;
};

const sendRequest = async (req, res) => {
    const userId = req.user.id;
    const {connected_userId} = req.body;

    try {
        if (!connected_userId) {
            return res.status(400).json({ message: 'connected_userId is required' });
        }

        if (userId === connected_userId) {
            return res.status(400).json({ message: 'You cannot connect with yourself' });
        }

        const requestProfileId = await getProfileIdByUserId(userId);
        const receiverProfileId = await getProfileIdByUserId(connected_userId);

        if (!requestProfileId || !receiverProfileId) {
            return res.status(404).json({ message: 'Profile not found for one or both users' });
        }

        const existingRequest = await pool.query(
            `SELECT id, status
             FROM network
             WHERE (requester_id = $1 AND receiver_id = $2)
                OR (requester_id = $2 AND receiver_id = $1)
             LIMIT 1`,
            [requestProfileId, receiverProfileId]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(409).json({
                message: 'A connection request between these users already exists',
                network: existingRequest.rows[0],
            });
        }

        const newConnection = await pool.query(
            `INSERT INTO network (requester_id, receiver_id, status) VALUES ($1, $2, $3) RETURNING *`,
            [requestProfileId, receiverProfileId, networkStatus.PENDING]
        );

        const requesterProfile = await getProfileCardByProfileId(requestProfileId);
        const receiverProfile = await getProfileCardByProfileId(receiverProfileId);

        res.status(201).json({
            id: newConnection.rows[0].id,
            status: newConnection.rows[0].status,
            created_at: newConnection.rows[0].created_at,
            requester_profile: requesterProfile,
            receiver_profile: receiverProfile,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating connection', error: err.message });
    }
};

const acceptRequest = async (req, res) => {
    const { networkId } = req.params;
    const userId = req.user.id;

    try {
        const receiverProfileId = await getProfileIdByUserId(userId);
        if (!receiverProfileId) {
            return res.status(404).json({ message: 'Receiver profile not found' });
        }

        const existingNetwork = await getNetworkById(networkId);
        if (!existingNetwork) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (existingNetwork.receiver_id !== receiverProfileId) {
            return res.status(403).json({ message: 'Only the receiver can accept this request' });
        }

        if (existingNetwork.status !== networkStatus.PENDING) {
            return res.status(400).json({ message: 'Only pending requests can be accepted' });
        }

        const updatedConnection = await pool.query(
            `UPDATE network
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [networkStatus.ACCEPTED, networkId]
        );

        const requesterProfile = await getProfileCardByProfileId(existingNetwork.requester_id);
        const receiverProfile = await getProfileCardByProfileId(existingNetwork.receiver_id);

        res.status(200).json({
            id: updatedConnection.rows[0].id,
            status: updatedConnection.rows[0].status,
            created_at: updatedConnection.rows[0].created_at,
            requester_profile: requesterProfile,
            receiver_profile: receiverProfile,
        });
        
    }
    catch (err) {
        res.status(500).json({ message: 'Error accepting connection request', error: err.message });
    }
};

const rejectRequest = async (req, res) => {
    const { networkId } = req.params;
    const userId = req.user.id;

    try {
        const receiverProfileId = await getProfileIdByUserId(userId);
        if (!receiverProfileId) {
            return res.status(404).json({ message: 'Receiver profile not found' });
        }

        const existingNetwork = await getNetworkById(networkId);
        if (!existingNetwork) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        if (existingNetwork.receiver_id !== receiverProfileId) {
            return res.status(403).json({ message: 'Only the receiver can reject this request' });
        }

        if (existingNetwork.status !== networkStatus.PENDING) {
            return res.status(400).json({ message: 'Only pending requests can be rejected' });
        }

        const deletedRequest = await pool.query(
            `DELETE FROM network
             WHERE id = $1
             RETURNING *`,
            [networkId]
        );

        const requesterProfile = await getProfileCardByProfileId(existingNetwork.requester_id);
        const receiverProfile = await getProfileCardByProfileId(existingNetwork.receiver_id);

        res.status(200).json({
            message: 'Connection request rejected and removed',
            rejectedRequest: {
                id: deletedRequest.rows[0].id,
                status: networkStatus.DECLINED,
                created_at: deletedRequest.rows[0].created_at,
                requester_profile: requesterProfile,
                receiver_profile: receiverProfile,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error rejecting connection request', error: err.message });
    }
};

const disconnectConnection = async (req, res) => {
    const { networkId } = req.params;
    const userId = req.user.id;

    try {
        const profileId = await getProfileIdByUserId(userId);
        if (!profileId) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const existingNetwork = await getNetworkById(networkId);
        if (!existingNetwork) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        const isParticipant = existingNetwork.requester_id === profileId || existingNetwork.receiver_id === profileId;
        if (!isParticipant) {
            return res.status(403).json({ message: 'Only participants can disconnect this connection' });
        }

        if (existingNetwork.status !== networkStatus.ACCEPTED) {
            return res.status(400).json({ message: 'Only accepted connections can be disconnected' });
        }

        const deletedConnection = await pool.query(
            `DELETE FROM network
             WHERE id = $1
             RETURNING *`,
            [networkId]
        );

        const requesterProfile = await getProfileCardByProfileId(existingNetwork.requester_id);
        const receiverProfile = await getProfileCardByProfileId(existingNetwork.receiver_id);

        res.status(200).json({
            message: 'Connection removed',
            connection: {
                id: deletedConnection.rows[0].id,
                status: deletedConnection.rows[0].status,
                created_at: deletedConnection.rows[0].created_at,
                requester_profile: requesterProfile,
                receiver_profile: receiverProfile,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error removing connection', error: err.message });
    }
};

const getPendingRequests = async (req, res) => {
    const userId = req.user.id;
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const limit = Number.isNaN(parsedLimit)
        ? NETWORK_DEFAULT_LIMIT
        : Math.min(Math.max(parsedLimit, 1), NETWORK_MAX_LIMIT);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);

    try {
        const receiverProfileId = await getProfileIdByUserId(userId);
        if (!receiverProfileId) {
            return res.status(404).json({ message: 'Receiver profile not found' });
        }

        const pendingRequests = await pool.query(
            `SELECT n.id,
                    n.requester_id,
                    p.bio AS requester_bio,
                    p.location AS requester_location,
                    p.links AS requester_links,
                    u.username AS requester_username,
                    u.avatar_url AS requester_avatar_url,
                    n.created_at
             FROM network n
             JOIN profiles p ON n.requester_id = p.id
             LEFT JOIN users u ON p.user_id = u.id
             WHERE n.receiver_id = $1 AND n.status = $2
             ORDER BY n.created_at DESC
             LIMIT $3 OFFSET $4`,
            [receiverProfileId, networkStatus.PENDING, limit, offset]
        );

        const totalCountResult = await pool.query(
            `SELECT COUNT(*)::int AS total_count
             FROM network
             WHERE receiver_id = $1 AND status = $2`,
            [receiverProfileId, networkStatus.PENDING]
        );

        const formattedPendingRequests = pendingRequests.rows.map((request) => ({
            id: request.id,
            created_at: request.created_at,
            requester_profile: {
                id: request.requester_id,
                username: request.requester_username,
                avatar_url: request.requester_avatar_url,
                bio: request.requester_bio,
                location: request.requester_location,
                links: request.requester_links,
            },
        }));

        const totalCount = totalCountResult.rows[0].total_count;
        const hasMore = offset + formattedPendingRequests.length < totalCount;

        res.status(200).json({
            pendingRequests: formattedPendingRequests,
            pagination: {
                totalCount,
                limit,
                offset,
                hasMore,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching pending requests', error: err.message });
    }
}

const getAllConnections = async (req, res) => {
    const userId = req.user.id;
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const limit = Number.isNaN(parsedLimit)
        ? NETWORK_DEFAULT_LIMIT
        : Math.min(Math.max(parsedLimit, 1), NETWORK_MAX_LIMIT);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);

    try {
        const profileId = await getProfileIdByUserId(userId);
        if (!profileId) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const connections = await pool.query(
            `SELECT n.id, n.status, n.created_at,
                    CASE
                        WHEN n.requester_id = $1 THEN n.receiver_id
                        ELSE n.requester_id
                    END AS other_profile_id,
                    CASE
                        WHEN n.requester_id = $1 THEN pr2.bio
                        ELSE pr.bio
                    END AS other_bio,
                    CASE
                        WHEN n.requester_id = $1 THEN pr2.location
                        ELSE pr.location
                    END AS other_location,
                    CASE
                        WHEN n.requester_id = $1 THEN pr2.links
                        ELSE pr.links
                    END AS other_links,
                    CASE
                        WHEN n.requester_id = $1 THEN u2.username
                        ELSE u1.username
                    END AS other_username,
                    CASE
                        WHEN n.requester_id = $1 THEN u2.avatar_url
                        ELSE u1.avatar_url
                    END AS other_avatar_url
             FROM network n
             JOIN profiles pr ON n.requester_id = pr.id
             JOIN users u1 ON pr.user_id = u1.id
             JOIN profiles pr2 ON n.receiver_id = pr2.id
             JOIN users u2 ON pr2.user_id = u2.id
             WHERE (n.requester_id = $1 OR n.receiver_id = $1) AND n.status = $2
             ORDER BY n.created_at DESC
             LIMIT $3 OFFSET $4`,
            [profileId, networkStatus.ACCEPTED, limit, offset]
        );

        const totalCountResult = await pool.query(
            `SELECT COUNT(*)::int AS total_count
             FROM network
             WHERE (requester_id = $1 OR receiver_id = $1) AND status = $2`,
            [profileId, networkStatus.ACCEPTED]
        );

        const formattedConnections = connections.rows.map((connection) => ({
            id: connection.id,
            status: connection.status,
            created_at: connection.created_at,
            other_profile: {
                id: connection.other_profile_id,
                username: connection.other_username,
                avatar_url: connection.other_avatar_url,
                bio: connection.other_bio,
                location: connection.other_location,
                links: connection.other_links,
            },
        }));

        const totalCount = totalCountResult.rows[0].total_count;
        const hasMore = offset + formattedConnections.length < totalCount;

        res.status(200).json({
            connections: formattedConnections,
            pagination: {
                totalCount,
                limit,
                offset,
                hasMore,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching connections', error: err.message });
    }
}

export default {
    sendRequest,
    acceptRequest,
    rejectRequest,
    disconnectConnection,
    getPendingRequests,
    getAllConnections
};