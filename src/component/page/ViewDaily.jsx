import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { db } from "../../firebase"

//ui
import Header from "../ui/Header";
import Title from "../ui/Title";

import DailyList from "../DailyRecord/DailyList";

//image

//styled
const Wrapper = styled.div`
    width:100%;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    width:100%;
    margin-top:100px;
`

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`

const ContentsFrame = styled.div`
    width:100%;
`

function ViewDaily(props) {

    const [posts, setPosts] = useState([]);

    useEffect(function() {
        let tempData = [];

        db.collection('daily').get().then(function(qs) {
            qs.forEach(function(doc) {
                tempData.push(doc.data()) // <<===== doc마다 tempData를 배열에 추가
            })

            setPosts(tempData);
        })
    }, [])

    return (
        
        <Wrapper>
            <Header></Header>

            
            <TitleFrame>
                <Title text="현재 감정점수는 61점입니다."></Title>
            </TitleFrame>

            <DivideLine></DivideLine>

            <ContentsFrame>
                <DailyList posts={posts}></DailyList>
            </ContentsFrame>

        </Wrapper>
        
    )   

}

export default ViewDaily;