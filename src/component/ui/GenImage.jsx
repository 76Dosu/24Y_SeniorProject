import React from "react";
import styled from "styled-components";

const GenImageItems = styled.img`
    width:100%;
    height:auto;
    border-radius:36px;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.15);

    object-fit:cover;
    overflow:hidden;
    transition:.3s;

    filter: ${({ isSelected }) => (isSelected ? "none" : "grayscale(1)")};
`
    

function GenImage(props) {
    
    const { imgURL, isSelected } = props;

    return (
        <GenImageItems src={imgURL} isSelected={isSelected}></GenImageItems>
    )

}

export default GenImage;