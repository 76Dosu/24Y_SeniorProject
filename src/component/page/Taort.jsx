import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { db } from "../../firebase";

import TarotCardList from "../TarotCard/TarotCardList";
import Title from "../ui/Title";
import SubTitle from "../ui/SubTitle"
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

import LogoImage from '../../images/logo-icon.png';

function Tarot(props) {

    const [selectedCards, setSelectedCards] = useState([]); // 선택한 카드 관리
    const [flippedCards, setFlippedCards] = useState([]); // 각 카드의 뒤집힘 상태를 관리
    const [data, setData] = useState([]);
    const [imageUrls, setImageUrls] = useState({}); // 이미지 URL을 저장할 상태
    const [showViewCard, setShowViewCard] = useState(false); // 화면 전환 상태 추가

    const navigate = useNavigate();
    const storage = getStorage();

    // 데이터 받아오기
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

    // 이미지 데이터 받아오기
    useEffect(() => {
        if (selectedCards.length > 0) {
            selectedCards.forEach((cardId) => {
                const imageRef = ref(storage, `images/${cardId}`); // 카드 ID에 맞는 이미지 참조

                getDownloadURL(imageRef)
                    .then((url) => {
                        setImageUrls((prevUrls) => ({
                            ...prevUrls,
                            [cardId]: url, // 카드 ID에 맞는 이미지 URL 저장
                        }));
                    })
                    .catch((error) => {
                        console.error("Error getting download URL: ", error);
                    });
            });
        }
    }, [selectedCards, storage]);

    const handleCardSelect = (cardId) => {
        if (selectedCards.includes(cardId)) {
            const newSelectedCards = selectedCards.filter(id => id !== cardId);
            setSelectedCards(newSelectedCards);
        } else if (selectedCards.length < 3) {
            setSelectedCards([...selectedCards, cardId]); // 카드 추가
        }
    };

    // 카드 뒤집기 처리
    const handleCardFlip = (cardId) => {
        setFlippedCards((prevFlippedCards) =>
            prevFlippedCards.includes(cardId)
                ? prevFlippedCards.filter(id => id !== cardId) // 이미 뒤집힌 카드를 다시 클릭하면 해제
                : [...prevFlippedCards, cardId] // 새로 뒤집힌 카드 추가
        );
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
                    <Title text="AI가 제안하는 스트레스 완화방법입니다" />
                    <SubTitle mt="8px" text="제안하는 완화방법은 과거의 긍정적인 일기를 바탕으로 생성되었습니다"></SubTitle>

                    <SelectedCardsList>
                        {selectedCards.map((cardId) => {
                            const card = data.find(card => card.id === cardId);

                            if (card) {
                                const tarotArray = card.tarot.split(',').map(item => item.trim());
                                const isFlipped = flippedCards.includes(cardId);
                                const imageUrl = imageUrls[card.id]; // 이미지 URL 가져오기

                                return (
                                    <SelectedCard key={cardId} onClick={() => handleCardFlip(cardId)} isFlipped={isFlipped}>
                                        <CardInner isFlipped={isFlipped}>
                                            <CardFront>
                                                <TarotCardLogoImg src={LogoImage} />
                                            </CardFront>
                                            <CardBack>
                                                {/* 이미지 표시 */}
                                                {imageUrl && (
                                                    <CardImage src={imageUrl} alt={card.title} />
                                                )}

                                                {/* 타로 핵심 내용 */}
                                                {tarotArray.map((tarotItem, index) => (
                                                    <CardDescription key={index} isFirst={index === 0}>
                                                        {tarotItem}
                                                    </CardDescription>
                                                ))}
                                            </CardBack>
                                        </CardInner>

                                    </SelectedCard>
                                );
                            }
                            return null;
                        })}
                    </SelectedCardsList>

                    <EntireButtonFrame>
                        <WriteButtonFrame onClick={() => navigate('/')}>
                            <WriteButtonF buttonName="확인했어요" />
                        </WriteButtonFrame>
                    </EntireButtonFrame>
                </ViewCardWrapper>
            </ContentContainer>
        </Wrapper>
    );
}

//styled components
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
    gap: 16px;
    margin-top: 40px;
`;

const SelectedCard = styled.div`
    width: 300px;
    min-height: 400px;
    perspective: 1000px; /* 3D 효과를 위한 원근감 */
    cursor: pointer;
`;

const CardInner = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    transform-style: preserve-3d;
    transition: transform 0.8s;
    transform: ${({ isFlipped }) => (isFlipped ? "rotateY(180deg)" : "rotateY(0)")};
`;

const CardFront = styled.div`
    position: absolute;
    width: 100%;
    height: 400px;
    backface-visibility: hidden; /* 앞면에 뒷면이 보이지 않도록 설정 */
    background-color: #2B3034;
    border-radius: 8px;
    padding:20px;

    display:flex;
    align-items:center;
    justify-content:center;
`;

const CardBack = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-color: #2B3034; /* 검은색 배경 */
    border-radius: 8px;
    padding:20px;
    transform: rotateY(180deg);
`;

const TarotCardLogoImg = styled.img`
    width: 30%;
`;

const CardDescription = styled.p`
    font-size: ${({ isFirst }) => (isFirst ? '16px' : '14px')};
    line-height: 1.4;
    margin-bottom: 8px;
    text-align: center;
    color: ${({ isFirst }) => (isFirst ? 'white' : '#CCC')};
    font-weight: ${({ isFirst }) => (isFirst ? 'bold' : 'normal')};

    &:last-child {
        margin-bottom:0px;  
    }
`;

const CardImage = styled.img`
    width: 100%;
    height: auto;
    margin-bottom: 24px;
    border-radius: 8px;
`;

export default Tarot;