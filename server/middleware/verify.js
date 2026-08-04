// import pool from '../db/dbpool.js'
// import options from '../config/auth.js'
// import '../config/dotenv.js'
//
//
// const verify = (accessToken, refreshToken, profile, callback) => {
//   const { _json: { id, login, avatar_url } } = profile
//
//
//   console.log(profile)
//
//   const userData = {
//     githubId: id,
//     username: login,
//     avatarUrl: avatar_url,
//     accessToken 
//   }
//   
//   console.log("USER DATA:")
//   console.log("githubId:", userData.githubId)
//   console.log("username:", userData.username)
//   console.log("avatarUrl:", userData.avatarUrl)
//   console.log("accessToken:", userData.accessToken)
//
//   try {
//     const results = await pool.query(`
//       SELECT * FROM users WHERE githubid=$1`, [userData.githubId])
//     const user = results.rows[0]
//     if (!user) {
//       const results = await.pool.query(`
//         INSERT INTO users (githubid, username, avatarurl, accesstoken)
//         VALUES($1, $2, $3, $4)
//         RETURNING *`, 
//         [userData.githubId, userData.username, userData.avatarUrl, accessToken])
//
//       const newUser = results.rows[0]
//       return callback(null, newUser)
//     }
//
//     reutrn ballback(null, user)
//   } catch {
//     return callback(error)
//   }
// }
//
// export const GitHub = new GitHubStrategy(options, verify)
