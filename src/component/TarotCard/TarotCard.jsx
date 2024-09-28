import React, { useState } from "react";
import styled from "styled-components";

import LogoImage from '../../images/logo-icon.png'

function TarotCard(props) {

    const [isFlipped, setIsFlipped] = useState(false);
    const { post } = props;

    const CardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        
        <CardContainer onClick={CardClick}>
            <CardInner isFlipped={isFlipped}>

                {/* 카드 앞면 */}
                <CardFront>
                    <TarotCardLogoImg src={LogoImage} />
                </CardFront>

                {/* 카드 뒷면 */}
                <CardBack>
                    <CardDate>{post.date}</CardDate>
                    <CardTitle>{post.title}</CardTitle>
                    <CardContents>{post.tarot}</CardContents>
                </CardBack>
            </CardInner>
        </CardContainer>

    )   

}

const CardContainer = styled.div`
    perspective: 1000px;
    width: 200px;
    height: 300px;
`;

const CardInner = styled.div`
    width: 100%;
    height: 100%;

    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    transform: ${({ isFlipped }) => isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFront = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;

    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #2B3034;
    border-radius: 12px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
`;

const CardBack = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;

    padding:20px;


    backface-visibility: hidden;
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #333;
    color: white;
    border-radius: 12px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
`;

const CardDate = styled.p`
    font-size: 12px;
`

const CardTitle = styled.p`
    font-size: 16px;
`

const CardContents = styled.p`
    font-size: 12px;
    text-align:justify;
    line-height:1.4;
`

const TarotCardLogoImg = styled.img`
    width: 30%;
`;

export default TarotCard;