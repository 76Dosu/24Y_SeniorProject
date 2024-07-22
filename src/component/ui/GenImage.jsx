import React from "react";
import styled from "styled-components";

const GenImageItems = styled.img`
    width:100%;
    height:auto;
    border-radius:36px;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.15);

    object-fit:cover;
    overflow:hidden;
`

function GenImage(props) {
    
    const { imgURL } = props;

    return (
        <GenImageItems src={imgURL}></GenImageItems>
    )

}

export default GenImage;