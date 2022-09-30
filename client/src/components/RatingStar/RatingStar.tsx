import React from 'react';
import ReactStars from 'react-stars'

interface IRatingProps {
    avgRating: number;
}

const RatingStar: React.FC<IRatingProps> = (props) => {
    return (
        <ReactStars
            count={5}
            value={props.avgRating}
            half={true}
            edit={false}
            size={20}
            color2="#FF4200"
        />
    );
};

export default RatingStar;
