import express from "express";

import ListingsController from "../controllers/listings.js";

const router = express.Router();

router.get("/", ListingsController.getAllListings);
router.get("/:id", ListingsController.getListingById);

router.get("/listings", (request, response) => {});
router.post("/listings/:propertyId", ListingsController.postNewListing);
router.get("/listings/:userId/all", ListingsController.getUserListings);
router.post(
  "/listings/images/:userId",
  ListingsController.postNewListingImages
);
router.post(
  "/listings/availability/:listingId",
  ListingsController.postNewListingAvailability
);

export default router;
