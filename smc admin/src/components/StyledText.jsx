import React from 'react';

const StyledText = ({ text }) => {

    return <div className='text-white' dangerouslySetInnerHTML={{ __html: text }} />;
};

export default StyledText;