import { Star } from 'lucide-react';

const ProductSummary = ({ name, price, discount, rating, votes, description, inventory }) => {
  const originalPrice = price;
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const isOutOfStock = inventory <= 0;

  return (
    <div className="space-y-2 sm:space-y-4">
      <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800">{name}</h1>
      <div className="flex items-center gap-1 sm:gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs sm:text-sm md:text-base text-gray-500">({votes} نظر)</span>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-sm sm:text-base md:text-lg text-gray-600">{description}</p>
        {!isOutOfStock ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {discount && (
              <span className="text-gray-400 text-xs sm:text-sm md:text-base line-through">{originalPrice.toLocaleString('fa-IR')} تومان</span>
            )}
            <span className="text-base sm:text-lg md:text-2xl font-bold text-pink-500">
              {discountedPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;