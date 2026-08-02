import { Router } from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/users.js";

// DEV NOTE: /me is the observed pattern for getting the current user in many APIs. It is used here to avoid confusion with the /users/:id route, which is not implemented yet since we don't have auth yet.
const router = Router();

router.get("/me", getCurrentUser);
// Using PATCH here instead of PUT since we are only updating homeCurrency and displayName. This is more in line with RESTful principles.
router.patch("/me", updateCurrentUser);

export default router;
