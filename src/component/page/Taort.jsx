import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";

import TarotCardList from "../TarotCard/TarotCardList";
import Title from "../ui/Title";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

function Tarot(props) {
    const [selectedCards, setSelectedCards] = useState([]); // 선택한 카드 관리
    const [data, setData] = useState([]);
    const [showViewCard, setShowViewCard] = useState(false); // 화면 전환 상태 추가

    const navigate = useNavigate();

    useEffect(() => {
        let tempData = [];

        db.collection("tarot")
            .get()
            .then(function (qs) {
                qs.forEach(function (doc) {
                    tempData.push({ id: doc.id, ...doc.data() }); // ID와 데이터를 함께 저장
                });

                setData(tempData);
            });
    }, []);

    const handleCardSelect = (cardId) => {
        if (selectedCards.includes(cardId)) {
            const newSelectedCards = selectedCards.filter(id => id !== cardId);
            setSelectedCards(newSelectedCards); 
        } else if (selectedCards.length < 3) {
            setSelectedCards([...selectedCards, cardId]); // 카드 추가
        }
    };

    return (
        <Wrapper>
            <ContentContainer showViewCard={showViewCard}>
                {/* ChoiceCard */}
                <ChoiceCardWrapper>
                    <CardCount>({selectedCards.length}/3)</CardCount>
                    <Title text="타로 카드 3장을 골라주세요!" />

                    <TarotCardList
                        posts={data}
                        selectedCards={selectedCards}
                        onCardSelect={handleCardSelect}
                    />

                    <EntireButtonFrame>
                        <WriteButtonFrame onClick={() => navigate('/viewDaily')}>
                            <WriteButtonUF buttonName="이전으로"></WriteButtonUF>
                        </WriteButtonFrame>

                        <WriteButtonFrame onClick={() => setShowViewCard(true)}>
                            <WriteButtonF buttonName="타로보기" />
                        </WriteButtonFrame>
                    </EntireButtonFrame>
                </ChoiceCardWrapper>

                {/* ViewCard */}
                <ViewCardWrapper>
                    <Title text="운세를 확인해보세요" />
                    <SelectedCardsList>
                        {selectedCards.map((cardId) => {
                            const card = data.find(card => card.id === cardId);
                            return (
                                <SelectedCard key={cardId}>
                                    <CardTitle>{card.title}</CardTitle>
                                </SelectedCard>
                            );
                        })}
                    </SelectedCardsList>

                    <EntireButtonFrame>
                        <WriteButtonFrame>
                            <WriteButtonUF buttonName="공유하기" />
                        </WriteButtonFrame>

                        <WriteButtonFrame onClick={() => navigate('/')}>
                            <WriteButtonF buttonName="확인했어요" />
                        </WriteButtonFrame>
                    </EntireButtonFrame>
                </ViewCardWrapper>
            </ContentContainer>
        </Wrapper>
    );
}

//styled
const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const ContentContainer = styled.div`
    display: flex;
    width: 200vw;
    height: 100%;
    transition: transform 0.5s ease-in-out;
    transform: ${({ showViewCard }) => (showViewCard ? "translateX(-100vw)" : "translateX(0)")}; /* 이동 */
`;

const ChoiceCardWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 0px 6%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bcColor);
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
    padding: 0px 6%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--main-bcColor);
`;

const SelectedCardsList = styled.div`
    display: flex;
    align-items: center;
    gap:16px;

    margin-top: 40px;
`;

const SelectedCard = styled.div`
    width:200px;
    height:300px;
    display:flex;
    align-items:center;
    justify-content: center;

    color: white;
    padding:16px;

    background-color: ${({ isSelected }) => (isSelected ? "#FFDD57" : "#2B3034")}; // 선택 여부에 따라 색상 변경
    border-radius: 12px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
    cursor: pointer;
`;

const CardTitle = styled.p`
    font-size:20px;
    font-weight:bold;
`

export default Tarot;