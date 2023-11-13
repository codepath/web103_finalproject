import React from "react";
import ListingCarousel from "./ListingCarousel";
import { BsFillStarFill } from "react-icons/bs";
import { format, isSameMonth } from "date-fns";

const ListingCard = ({ listing }) => {
  if (!listing || !listing.availability) {
    console.error('Invalid or missing listing data:', listing);
    return null; // or handle it in another way
  }

  const formattedAvailability = listing.availability.map((item) => {
    const startDate = new Date(item.start_availability);
    const endDate = new Date(item.end_availability);

    if (!startDate || !endDate) {
      console.error('Invalid date range:', item);
      return null; // or handle it in another way
    }

    const startMonth = format(startDate, "MMM");
    const endMonth = format(endDate, "MMM");

    let formattedDate;

    if (isSameMonth(startDate, endDate)) {
      formattedDate = `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`;
    } else {
      formattedDate = `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
    }

    return formattedDate;
  });

  if (formattedAvailability.includes(null)) {
    console.error('Invalid date range in availability:', listing.availability);
    return null; // or handle it in another way
  }

  return (
    <div className="flexbg-white w-full max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <ListingCarousel images={listing.images} />
      </a>
      <div className="px-5 py-2 pb-5">
        <div className="flex justify-between">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {listing.city}, {listing.state}
          </h5>
          <div className="flex items-center">
            <BsFillStarFill style={{ marginRight: "5px" }} /> {listing.rating}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-md font-bold text-gray-900 dark:text-white">
            {formattedAvailability.join(", ")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-md font-bold text-gray-900 dark:text-white">
            {listing.price_per_night} per night
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
