import { pool } from "../config/database.js";

const updateUserProfile = async (req, res) => {
  try {
    //get user data from the request
    const { user } = req;

    //check if the user is authenticated. if they are not, then return a 401 unauthorized error
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //access the users ID from the user object if it's stored in session or token
    const userId = user.id;

    //verify the user is updating their own profile by checking the user ID
    if (userId != req.params.userId) {
      return res
        .status(403)
        .json({ error: "Forbiden. You can only update your own profile." });
    }

    //update the users email:
    const { newEmail } = req.body; //assuming the new email is sent in the request body

    //update user's email in the database:
    const updateQuery = "UPDATE users SET email = $1 WHERE id = $2";
    const updateValues = [newEmail, userId];

    const result = await pool.query(updateQuery, updateValues);

    if (result.rowCount > 0) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Profile update failed." });
    }

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error " });
  }
};

const updateUserProfilePhoto = async (req, res) => {
  try {
    //update the users email:
    const { id, newImageUrl } = req.body; //assuming the new email is sent in the request body

    //update user's email in the database:
    const updateQuery = "UPDATE users SET image_url = $1 WHERE id = $2";
    const updateValues = [newImageUrl, id];

    const result = await pool.query(updateQuery, updateValues);

    if (result.rowCount > 0) {
      res.json({ message: "Profile updated successfully. " });
    } else {
      res.status(500).json({ error: "Profile update failed." });
    }

    // res.json({ message: "Profile updated successfully." })
  } catch (error) {
    res.status(500).json({ error: "Internal server error " });
  }
};

export default {
  updateUserProfile,
  updateUserProfilePhoto,
};
