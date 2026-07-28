// `password` is the plaintext demo credential you log in with — resetDatabase.js
// bcrypt-hashes it before insert, so nothing plaintext ever reaches the table.
export const demoUsers = [
    {
        username: "carla_t",
        email: "demo@matchlens.com",
        password: "password123",
        profile_image_url: null,
        total_points: 24580,
    },
    {
        username: "jordan_m",
        email: "fan@matchlens.com",
        password: "letmein",
        profile_image_url: null,
        total_points: 18740,
    },
    {
        username: "sam_fc",
        email: "scout@matchlens.com",
        password: "scout2024",
        profile_image_url: null,
        total_points: 15220,
    },
];

export const demoFollowedTeams = [
    { user_id: 1, api_team_id: "1", team_name: "Liverpool" },
    { user_id: 1, api_team_id: "3", team_name: "Man City" },
    { user_id: 2, api_team_id: "2", team_name: "Arsenal" },
    { user_id: 3, api_team_id: "1", team_name: "Liverpool" },
];

export const demoComments = [
    {
        user_id: 1,
        api_match_id: "101",
        content: "What a finish, did not see that coming!",
    },
    {
        user_id: 2,
        api_match_id: "101",
        content: "Ref missed a clear penalty there.",
    },
    {
        user_id: 3,
        api_match_id: "102",
        content: "This defense has been shaky all season.",
    },
];

export const demoPredictions = [
    {
        user_id: 1,
        api_match_id: "101",
        predicted_home_score: 2,
        predicted_away_score: 1,
        points_awarded: 50,
    },
    {
        user_id: 2,
        api_match_id: "101",
        predicted_home_score: 1,
        predicted_away_score: 1,
        points_awarded: 0,
    },
    {
        user_id: 3,
        api_match_id: "102",
        predicted_home_score: 3,
        predicted_away_score: 0,
        points_awarded: 0,
    },
];

export const demoNotifications = [
    {
        user_id: 1,
        api_team_id: "1",
        api_match_id: null,
        notification_type: "match_alert",
        message: "Liverpool kicks off in 1 hour!",
    },
    {
        user_id: 2,
        api_team_id: "2",
        api_match_id: null,
        notification_type: "transfer_news",
        message: "Arsenal announced a new signing.",
    },
];

export const demoVideoLinks = [
    {
        user_id: 1,
        api_match_id: "101",
        title: "Match Highlights - Full Time",
        video_url: "https://youtube.com/watch?v=example1",
        provider: "youtube",
    },
    {
        user_id: 3,
        api_match_id: "102",
        title: "Best Saves of the Match",
        video_url: "https://youtube.com/watch?v=example2",
        provider: "youtube",
    },
];
