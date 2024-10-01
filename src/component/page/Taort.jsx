import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";

import TarotCardList from "../TarotCard/TarotCardList";
import Title from "../ui/Title";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

function Tarot(props) {
    
    const [selectedCount, setSelectedCount] = useState(0);
    const [data, setData] = useState([]);
    const [showViewCard, setShowViewCard] = useState(false); // 화면 전환 상태 추가

    const navigate = useNavigate();

    useEffect(() => {
        let tempData = [];

        db.collection("tarot")
            .get()
            .then(function (qs) {
                qs.forEach(function (doc) {
                    tempData.push(doc.data()); // <<===== doc마다 tempData를 배열에 추가
                });

                setData(tempData);
            });
    }, []);

    // 상태가 변경될 때마다 로그 확인
    useEffect(() => {
        console.log("showViewCard:", showViewCard);
    }, [showViewCard]);

    return (
        <Wrapper>
            <ContentContainer showViewCard={showViewCard}>
                {/* ChoiceCard */}
                <ChoiceCardWrapper>
                    <CardCount>({selectedCount}/3)</CardCount>
                    <Title text="카드 3장을 골라주세요!" />

                    <TarotCardList posts={data} setSelectedCount={setSelectedCount} />

                    <EntireButtonFrame>
                        <WriteButtonFrame onClick={() => navigate('/viewDaily')}>
                            <WriteButtonUF buttonName="이전으로"></WriteButtonUF>
                        </WriteButtonFrame>

                        <WriteButtonFrame onClick={() => setShowViewCard(true)}>
                            <WriteButtonF buttonName="타로보기"/>
                        </WriteButtonFrame>
                    </EntireButtonFrame>
                </ChoiceCardWrapper>

                {/* ViewCard */}
                <ViewCardWrapper>
                    <Title text="선택된 카드 보기" />
                    <CardCount>({selectedCount}/3)</CardCount>

                    <TarotCardList posts={data} setSelectedCount={setSelectedCount} />

                    <EntireButtonFrame>
                        <WriteButtonFrame onClick={() => navigate(-1)}>
                            <WriteButtonUF buttonName="이전으로"></WriteButtonUF>
                        </WriteButtonFrame>

                        <WriteButtonFrame onClick={() => setShowViewCard(true)}>
                            <WriteButtonF buttonName="확인했어요"/>
                        </WriteButtonFrame>
                    </EntireButtonFrame>
                </ViewCardWrapper>
            </ContentContainer>
        </Wrapper>
    );
}

//styled
const Wrapper = styled.div`
    width: 200vw;
    height: 100vh;
`;

const ContentContainer = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;

    transition: transform 0.5s ease-in-out;
    transform: ${({ showViewCard }) => (showViewCard ? "translateX(-100vw)" : "translateX(0)")}; /* 이동 */
`;

const ChoiceCardWrapper = styled.div`
    width: 100vw; /* 화면 크기 */
    height: 100vh;
    padding: 0px 11.54%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bcColor);

    border:1px solid red;
`;

const CardCount = styled.div`
    margin-bottom: 8px;
    font-size: 24px;
    color: white;
`;

const EntireButtonFrame = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 60px;
`;

const WriteButtonFrame = styled.div`
    display: flex;
    width: fit-content;
    margin-right: 20px;

    &:last-child {
        margin-right: 0px;
    }
`;

const ViewCardWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 0px 11.54%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bcColor);

    border:1px solid green;
`;

export default Tarot;