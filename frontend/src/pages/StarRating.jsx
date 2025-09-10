import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={value}
              className="hidden"
              onClick={() => setRating && setRating(value)}
            />
            <FaStar
              size={28}
              className={`transition-colors duration-200 ${
                value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;