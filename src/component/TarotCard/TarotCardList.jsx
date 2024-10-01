import React, { useState } from "react";
import styled from "styled-components";

//ui
import TarotCard from "./TarotCard.jsx";

function TarotCardList({ posts, setSelectedCount }) {

    const [selectedCards, setSelectedCards] = useState([]); // 선택한 카드 ID를 추적하는 배열
    const [isShaking, setIsShaking] = useState(false); // 카드를 흔들기 위한 상태

    const handleCardSelect = (post) => {
        if (selectedCards.includes(post.id)) {
            const newSelectedCards = selectedCards.filter(id => id !== post.id);
            setSelectedCards(newSelectedCards);
            setSelectedCount(newSelectedCards.length); 
            
        } else if (selectedCards.length < 3) {
            const newSelectedCards = [...selectedCards, post.id];
            setSelectedCards(newSelectedCards);
            setSelectedCount(newSelectedCards.length);
        } else {
            // 3개가 이미 선택된 경우에는 흔들림 애니메이션 실행
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500); // 애니메이션 0.5초 후 흔들림 상태 해제
        }

        if (selectedCards.length === 2 && !selectedCards.includes(post.id)) {
            // 세 번째 카드 선택 시
            console.log("다 정했어요");
        }
    };

    return (
        <Wrapper>
            <DisplayContainer>
                {posts.map((post) => (
                    <TarotCard
                        key={post.id}
                        post={post}
                        onSelect={() => handleCardSelect(post)} // 카드 선택 시 호출
                        isSelected={selectedCards.includes(post.id)} // 카드가 선택되었는지 확인
                        isShaking={isShaking && selectedCards.length >= 3} // 선택 불가 시 흔들리게 함
                    />
                ))}
            </DisplayContainer>
        </Wrapper>
    );
}

//styled
const Wrapper = styled.div`
    width: 100%;
    overflow: scroll;
    padding: 40px;
`;

const DisplayContainer = styled.div`
    width:fit-content;
    display:flex;
    /* margin-top:40px; */
    gap:16px;
`;

export default TarotCardList;