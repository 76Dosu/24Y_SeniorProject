import React from "react";
import styled from "styled-components";

//ui
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle";
import Service from "../ui/Service";

//image
import DailyWrite from '../../images/_DailyWrite.png';
import DailyManage from '../../images/_DailyManage.png';

//styled
const Wrapper = styled.div`
    width:100%;
    height:100vh;
    padding:0px 11.54%;
    background-color:var(--main-bcColor);

    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
`

const ServiceFrame = styled.div`
    display:flex;
    justify-content:space-between;
    margin-bottom:80px;
`

function MainPage() {

    return (
        
        <Wrapper>
            <Title text="오늘 하루는 어땠나요? 하루를 기록해보세요." ></Title>

            <SubTitle text="해당 프로토타입은 전시회 체험을 위해 구현됐습니다."
                      mt="8px"
                      mb="80px">

            </SubTitle>

            <ServiceFrame>
                <Service serviceName="일기작성" 
                         serviceIcon={DailyWrite} 
                         navigateLink="write"></Service>
                <Service color="white"
                         bc="#2B3034" 
                         serviceName="일기관리" 
                         serviceIcon={DailyManage} 
                         navigateLink="viewDaily"></Service>
            </ServiceFrame>
        </Wrapper>
        
    )   

}

export default MainPage;