import React, { useEffect, useState } from "react";
import { TbChevronCompactLeft, TbChevronCompactRight } from "react-icons/tb";
import { RxDotFilled } from "react-icons/rx";

const ListingCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (imageIndex) => {
    setCurrentIndex(imageIndex);
  };

  if (images) {
    console.log(images[currentIndex].image_url);
  }

  return (
    <div className="max-w-[3400px] h-[780px] w-full py-16 px-4 relative group">
      <div
        style={{
          height: "300px",
          width: "auto",
          backgroundImage: `url(${images[currentIndex].image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "1rem",
          display: "flex", // Use flexbox for icon centering
          justifyContent: "space-between", // Ensure space between icons
          alignItems: "center", // Center icons vertically
          position: "relative", // Ensure the div is positioned for z-index
        }}
        className="w-full duration-500"
      >
        {/* Left Arrow */}
        <div className="flex text-2xl text-white rounded-full p-2 cursor-pointer">
          <TbChevronCompactLeft onClick={prevSlide} size={30} />
        </div>
        {/* Right Arrow */}
        <div className="text-3xl rounded-full p-2 cursor-pointer text-white ">
          <TbChevronCompactRight onClick={nextSlide} size={30} />
        </div>
      </div>
      <div className="flex justify-center py-2">
        {images.map((image, imageIndex) => (
          <div
            key={imageIndex}
            onClick={() => goToImage(imageIndex)}
            className="px-2 text-2xl cursor-pointer"
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingCarousel;
