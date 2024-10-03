import React from "react";
import styled, { keyframes, css } from "styled-components";
import LogoImage from '../../images/logo-icon.png'

// 흔들리는 애니메이션 정의
const shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
`;

function TarotCard(props) {
    const { onSelect, isSelected, isShaking } = props; // 선택 시 호출되는 함수와 선택 여부, 흔들림 여부를 props로 받음

    return (
        <CardContainer onClick={onSelect} isSelected={isSelected} isShaking={isShaking}>
            <TarotCardLogoImg src={LogoImage} />
        </CardContainer>
    );
}

//styled
const CardContainer = styled.div`
    perspective: 1000px;
    width: 180px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;

    border: ${({ isSelected }) => (isSelected ? "1px solid #FFDD57" : "1px solid #2B3034")};
    background-color: #2B3034;
    border-radius: 12px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    transition: transform 0.2s ease;

    ${({ isShaking }) => 
        isShaking &&
        css`
            animation: ${shake} 0.5s ease;
        `
    }; // 흔들리는 애니메이션 조건부 적용
`;

const TarotCardLogoImg = styled.img`
    width: 30%;
`;

export default TarotCard;