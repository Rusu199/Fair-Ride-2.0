
import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
}

const Rating: React.FC<RatingProps> = ({ value }) => {
  return (
    <div className="flex items-center space-x-1">
      <Star size={16} className="text-primary-orange fill-current" />
      <span className="text-sm font-medium text-neutral-dark-gray">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;