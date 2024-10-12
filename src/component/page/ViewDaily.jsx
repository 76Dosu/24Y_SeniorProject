import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase"

//ui
import Title from "../ui/Title";
import DailyList from "../DailyRecord/DailyList";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

//styled
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

const ReturnButtonFrame = styled.div`
    width:fit-content;
`

const TitleFrame = styled.div`
    padding-top:100px;
    width:100%;
`

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`

const ContentsFrame = styled.div`
    width:100%;
`

const HighlightedScore = styled.span`
    color: var(--main-color);
    font-weight: bold;
    font-size: 32px;
`

// 팝업 스타일
const FunctionBtn = styled.div`
    display:flex;
    gap:20px;
    padding-top: 40px;
`

const WhatIsThis = styled.div`
    width:fit-content;
`

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter:blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

const ModalContent = styled.div`
    background-color: var(--main-bcColor);
    padding:40px 20px;
    border-radius: 24px;
    width: 40%;
    color:white;
    
    display:flex;
    flex-direction:column;
    align-items: center;
`;

const ModalTitle = styled.p`
    font-size: 24px;
    font-weight: bold;
    color:var(--main-color);

    margin-bottom:24px;
`;

const ModalParagraph = styled.p`
    font-size: 16px;
    line-height:1.4;
    margin-bottom:4px;
    color:white;
`;

const ModalCheck = styled.div`
    margin-top:40px;
`

function ViewDaily() {

    const [data, setData] = useState([]);
    const [url, setUrl] = useState([]);
    const [averageScore, setAverageScore] = useState(0); // 평균 점수를 위한 상태 추가
    const navigate = useNavigate();

    // 팝업 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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

    useEffect(function () {
        let tempData = [];

        db.collection('daily').get().then(function (qs) {
            qs.forEach(function (doc) {
                tempData.push(doc.data()) // <<===== doc마다 tempData를 배열에 추가
            })

            tempData.reverse();
            setData(tempData);

            const totalScore = tempData.reduce((sum, item) => sum + (item.score ? parseInt(item.score, 10) : 0), 0);
            const avgScore = tempData.length > 0 ? (totalScore / tempData.length).toFixed(0) : 0;
            setAverageScore(avgScore); // 평균 점수를 상태에 저장
        })
    }, [])

    return (
        <Wrapper>
            <FunctionBtn>
                <ReturnButtonFrame onClick={() => { navigate('/') }}>
                    <WriteButtonF buttonName="처음으로"></WriteButtonF>
                </ReturnButtonFrame>

                <WhatIsThis onClick={openModal}>
                    <WriteButtonUF buttonName="이게 뭐하는거에요?"></WriteButtonUF>
                </WhatIsThis>
            </FunctionBtn>      

            <TitleFrame>
                <Title text={<>현재 감정점수는 <HighlightedScore>{averageScore}</HighlightedScore>점입니다.</>}></Title>
            </TitleFrame>

            <DivideLine></DivideLine>

            <ContentsFrame>
                <DailyList imgUrl={url} posts={data} onClickItem={(p) => { navigate('/post/' + p.id) }}></DailyList>
            </ContentsFrame>

            {/* 팝업이 열려 있을 때만 오버레이와 모달을 표시 */}
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>전시 관람객들이 작성한 일기들을 살펴보세요.</ModalTitle>
                        <ModalParagraph>작성된 일기들을 종합하고 감정 점수를 평균냅니다.</ModalParagraph>
                        <ModalParagraph>과거의 일기들을 통해 타로를 확인해보세요.</ModalParagraph>
                        <ModalCheck onClick={closeModal}>
                            <WriteButtonUF buttonName="확인했어요">확인했어요</WriteButtonUF>
                        </ModalCheck>

                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    )
}

export default ViewDaily;