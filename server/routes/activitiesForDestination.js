// Mounted at /api/destinations/:destinationId/activities — list all activities for a destination, or add a new one.
import { Router } from "express";
import { getActivitiesForDestination, createActivity } from "../controllers/activities.js";

// Why mergeParams: true is here:
//
// In server.js, this router gets attached like:
//   app.use("/api/destinations/:destinationId/activities", router);
//
// The ":destinationId" part is written in THAT line, in server.js -- not
// anywhere in this file. This router only defines router.get("/") and
// router.post("/"); it never writes ":destinationId" itself.
//
// By default, a Router only fills in req.params for params IT wrote in its
// own routes. Example: for a request to /api/destinations/42/activities --
//   - WITHOUT mergeParams: req.params here is {} (empty). The "42" was
//     matched by server.js's path, but this router never asked for it, so
//     it never arrives.
//   - WITH mergeParams: true: req.params here is { destinationId: "42" }.
//     This flag tells the router "also give me whatever params were already
//     captured by however I got mounted."
//
// So this flag is what makes req.params.destinationId actually show up
// inside getActivitiesForDestination/createActivity.
const router = Router({ mergeParams: true });

router.get("/", getActivitiesForDestination);
router.post("/", createActivity);

export default router;
