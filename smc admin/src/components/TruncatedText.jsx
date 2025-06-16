import React from 'react';

const TruncatedText = ({ text, len }) => {
    const words = text.split(' ');

    const isTruncated = words.length > len;

    const truncatedText = isTruncated ? words.slice(0, len).join(' ') + '...' : text;

    return (
        <span className=' whitespace-normal text-xl  text-white mx-8 font-poppins font-normal'>
            {truncatedText}
        </span>
    );
};

export default TruncatedText;