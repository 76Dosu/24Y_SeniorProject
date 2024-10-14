import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase'

import Title from "../ui/Title"
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

// style
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:100px 11.54%;
    background-color:var(--main-bcColor);
`;

const ReturnButtonFrame = styled.div`
    width:fit-content;
`;

const TitleFrame = styled.div`
    width:100%;
`;

const DailyScore = styled.p`
    font-size: 20px;
    font-weight: 400;
    color:var(--main-color);
    margin-bottom:8px;
`;

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`;

const ContentsContainer = styled.div`
    width:100%;
    margin-top:24px;
    display:flex;
    flex-wrap:wrap;
    gap:24px;
`;

const DailyContainer = styled.div`
    width:30%;
    height:fit-content;
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`;

const DailyContentsTitle = styled.p`
    font-size: 24px;
    font-weight: 700;
    color:white;
`;

const DailyContents = styled.p`
    font-size:16px;
    font-weight: 400;
    line-height:1.8;
    color:#DDDDDD;
    margin:12px 0px 0px 0px;
`;

const DailyImage = styled.img`
    width:100%;
    border-radius:8px;
    margin-top:12px;
`;

const DailyAnalContainer = styled.div`
    width:calc(70% - 24px);
    height:fit-content;
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`;

const DailyAnalysisItem = styled.div`
    width:100%;
    margin-bottom:40px;

    &:last-child {
        margin-bottom:0px;
    }
`;

const GoTarot = styled.p`
    width:100%;
    color:white;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    padding:16px 0px;
    margin-top:24px;
    border-radius:8px;
    background-color:var(--main-bcColor);
    transition: .3s;

    &:hover {
        background-color:white;
        color:#333;
    }
`;

// 팝업(모달) 스타일
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

const ModalContent = styled.div`
    background-color: var(--main-bcColor);
    padding: 40px 20px;
    border-radius: 24px;
    width: 40%;
    color: white;
     
    display:flex;
    flex-direction:column;
    align-items: center;
`;

const ModalParagraph = styled.p`
    font-size: 20px;
    line-height:1.4;
    margin-bottom:4px;
    color:white;
`;

const HighlightedText = styled.span`
    color: var(--main-color);
    font-weight: bold;
    font-size: 24px;
`;

const ModalCheck = styled.div`
    margin-top:40px;
`;
// 타로
const TarotFrame = styled.div`
    width: 100%;
    height: 100%;
    background-color: #2B3034;
    border-radius: 8px;
`;

const CardDescription = styled.p`
    font-size: ${({ isFirst }) => (isFirst ? '20px' : '14px')};
    line-height: 1.4;
    margin-top: ${({ isFirst }) => (isFirst ? '20px' : '8px')};
    text-align: center; 
    color: ${({ isFirst }) => (isFirst ? 'white' : '#CCC')};
    font-weight: ${({ isFirst }) => (isFirst ? 'bold' : 'normal')};

    &:last-child {
        margin-bottom:0px;  
    }
`;

function DailyDetailView() {

    const postId = useParams().id;
    const navigate = useNavigate();

    const [post, setPost] = useState({
        id: "",
        date: "",
        choosedImage: "",
        keyword: "",
        prompt: "",
        title: "",
        score: "",
        reason: "",
        solution: "",
        tarot: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', rank: '', total: '' });

    const tarotArray = post.tarot.split(',').map(item => item.trim());

    const [base64Url, setBase64Url] = useState('');
    const storage = getStorage();
    const listRef = ref(storage, 'images/');

    useEffect(() => {
        listAll(listRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    if (itemRef.name === `${postId}`) {
                        getDownloadURL(itemRef).then((url) => {
                            setBase64Url(url);
                        }).catch((error) => {
                            console.error("Error getting download URL: ", error);
                        });
                    }
                });
            })
            .catch((error) => {
                console.error("Error listing images: ", error);
            });
    }, [listRef, postId]);

    useEffect(() => {
        db.collection('daily').doc(postId).get().then(function (doc) {
            setPost(doc.data());

            db.collection('daily').get().then((querySnapshot) => {
                const scores = [];
                querySnapshot.forEach((doc) => {
                    scores.push(doc.data().score);
                });

                scores.sort((a, b) => b - a);
                const currentScoreRank = scores.indexOf(doc.data().score) + 1;

                setModalContent({
                    title: doc.data().title,
                    rank: currentScoreRank,
                    total: scores.length
                });
                setIsModalOpen(true);

            }).catch((error) => {
                console.error("Error fetching scores: ", error);
            });

        }).catch((error) => {
            console.error("Error fetching post data: ", error);
        });
    }, [postId]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Wrapper>
            <TitleFrame>
                <DailyScore>감정 점수 {post.score}점</DailyScore>
                <Title text={post.title} />
            </TitleFrame>

            <DivideLine />

            <ContentsContainer>
                <DailyContainer>
                    <DailyContentsTitle>감정 카드</DailyContentsTitle>
                    <TarotFrame>
                        <DailyImage src={base64Url} />
                        {tarotArray.map((tarotItem, index) => (
                            <CardDescription key={index} isFirst={index === 0}>
                                {tarotItem}
                            </CardDescription>
                        ))}
                    </TarotFrame>

                    <GoTarot onClick={() => { navigate('/tarot') }}>타로 뽑기</GoTarot>
                </DailyContainer>

                {/* 일기 분석 내용 */}
                <DailyAnalContainer>

                    {/* 일기내용 */}
                    <DailyAnalysisItem>
                        <DailyContentsTitle>일기 내용</DailyContentsTitle>
                        <DailyContents>{post.prompt}</DailyContents>
                    </DailyAnalysisItem>

                    {/* 근거 */}
                    <DailyAnalysisItem>
                        <DailyContentsTitle>분석 근거</DailyContentsTitle>
                        <DailyContents>{post.reason}</DailyContents>
                    </DailyAnalysisItem>

                    {/* 피드백 */}
                    <DailyAnalysisItem>
                        <DailyContentsTitle>감정 피드백</DailyContentsTitle>
                        <DailyContents>{post.solution}</DailyContents>
                    </DailyAnalysisItem>

                    <ReturnButtonFrame onClick={() => { navigate('/viewDaily') }}>
                        <WriteButtonF buttonName="돌아가기"></WriteButtonF>
                    </ReturnButtonFrame>
                </DailyAnalContainer>
            </ContentsContainer>

            {/* 팝업(모달) */}
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalParagraph>
                            <HighlightedText>{modalContent.title}</HighlightedText>님의 감정점수는{' '}
                            <HighlightedText>{modalContent.total}</HighlightedText>명의 관람객 중{' '}
                            <HighlightedText>{modalContent.rank}</HighlightedText>등 입니다.
                        </ModalParagraph>
                        <ModalCheck onClick={closeModal}>
                            <WriteButtonUF buttonName="확인했어요">확인했어요</WriteButtonUF>
                        </ModalCheck>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    );
}

export default DailyDetailView;