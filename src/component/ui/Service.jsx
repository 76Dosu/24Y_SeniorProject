import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ServiceContainer = styled.div`
    width: 300px;
    height: 300px;
    background-color:${props => props.bc || "white"};
    border-radius:36px;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.15);
    transition: .3s;
    margin-right:100px;

    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;

    cursor: pointer;

    &:hover {
        transform:scale(1.03);
    }

    &:last-child {
        margin-right:0px;
    }
`

const ServiceName = styled.p`
    font-size:32px;
    font-weight: 700;
    color:${props => props.color || "#333"};

    margin-bottom:48px;
`

const ServiceIcon = styled.img`
    width:120px;
    height:120px;
`

function Service(props) {

    const { serviceName, serviceIcon, navigateLink, bc, color } = props;
    const navigate = useNavigate();

    return (
        
        <ServiceContainer bc={bc} onClick={() => {navigate(`/${navigateLink}`)}}>
            <ServiceName color={color}>{serviceName}</ServiceName>
            <ServiceIcon src={serviceIcon}></ServiceIcon>
        </ServiceContainer>

    )   

}

export default Service;