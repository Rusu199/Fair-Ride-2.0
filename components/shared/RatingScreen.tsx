import React, { useState } from 'react';
import { User } from '../../types';
import Header from './Header';
import Button from './Button';
import { Star } from 'lucide-react';

interface RatingScreenProps {
  userToRate: User;
  rideDetails: {
    pickup: string;
    dropoff: string;
  };
  isRatingDriver: boolean;
  onSubmit: (rating: number) => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ userToRate, rideDetails, isRatingDriver, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-light-gray">
      <Header title={isRatingDriver ? "Rate Your Driver" : "Rate Your Passenger"} />
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <img src={userToRate.photoUrl} alt={userToRate.name} className="w-24 h-24 rounded-full mb-4 shadow-lg" />
        <p className="text-xl font-bold text-neutral-dark-gray">How was your trip with {userToRate.name}?</p>
        <p className="text-sm text-neutral-medium-gray mt-1">{rideDetails.pickup} to {rideDetails.dropoff}</p>
        
        <div className="flex space-x-2 my-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} stars`}
              className="focus:outline-none"
            >
              <Star
                size={40}
                className={`transition-colors duration-150 ${(hoverRating || rating) >= star ? 'text-primary-orange fill-primary-orange' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        
        <div className="w-full max-w-xs">
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Rating
          </Button>
          <button onClick={() => onSubmit(0)} className="mt-4 text-sm text-neutral-medium-gray hover:underline">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingScreen;