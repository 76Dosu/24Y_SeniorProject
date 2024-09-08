import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase"

//ui
import Header from "../ui/Header";
import Title from "../ui/Title";

import DailyList from "../DailyRecord/DailyList";

//image

//styled
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
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

function ViewDaily() {

    const [data, setData] = useState([]);
    const [url, setUrl] = useState([]);
    const [averageScore, setAverageScore] = useState(0); // 평균 점수를 위한 상태 추가
    const navigate = useNavigate();

    // Firebase
    const storage = getStorage();
    const listRef = ref(storage, 'images/');

    useEffect(() => {
        // listAll()을 사용하여 디렉터리의 파일 목록 가져오기
        listAll(listRef)
            .then((res) => {
                // 각 파일의 URL을 가져오는 비동기 작업
                const urlPromises = res.items.map((itemRef) => 
                    getDownloadURL(itemRef) // 각 파일의 다운로드 URL을 가져옴
                );
                
                // 모든 URL이 받아질 때까지 기다림
                Promise.all(urlPromises)
                    .then((urlArray) => {
                        setUrl(urlArray.reverse()); // URL 배열 상태에 저장
                });
            })
            .catch((error) => {
                console.error("Error listing images: ", error);
            });
    }, [listRef, storage]);

    useEffect(function() {
        let tempData = [];

        db.collection('daily').get().then(function(qs) {
            qs.forEach(function(doc) {
                tempData.push(doc.data()) // <<===== doc마다 tempData를 배열에 추가
            })

            tempData.reverse();
            setData(tempData);

            const totalScore = tempData.reduce((sum, item) => sum + (item.score ? parseInt(item.score, 10) : 0), 0);
            const avgScore = tempData.length > 0 ? (totalScore / tempData.length).toFixed(0) : 0;
            setAverageScore(avgScore); // 평균 점수를 상태에 저장
        })
    }, [storage])

    return (
        
        <Wrapper>
            <Header></Header>

            
            <TitleFrame>
                <Title text={"현재 감정점수는 " + averageScore + "점입니다."}></Title>
            </TitleFrame>

            <DivideLine></DivideLine>

            <ContentsFrame>
                <DailyList imgUrl={url} posts={data} onClickItem={(p) => {navigate('/post/' + p.id)}}></DailyList>
            </ContentsFrame>

        </Wrapper>
        
    )   

}

export default ViewDaily;