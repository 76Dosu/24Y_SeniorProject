import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";

// Chart.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

import Title from "../ui/Title";
import DailyList from "../DailyRecord/DailyList";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:0px 11.54% 100px 11.54%;
    background-color:var(--main-bcColor);
`;

const TitleFrame = styled.div`
    padding-top:100px;
    width:100%;
`;

const HighlightedScore = styled.span`
    color: var(--main-color);
    font-weight: bold;
    font-size: 32px;
`;

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`;

const ContentsFrame = styled.div`
    width:100%;
`;

const FunctionBtn = styled.div`
    display:flex;
    gap:20px;
    padding-top: 40px;
`;

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
    const [averageScore, setAverageScore] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const navigate = useNavigate();

    // 팝업 상태 관리
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 차트 모달 상태 관리
    const openChartModal = () => {
        setIsChartModalOpen(true);
        document.body.style.overflowY = 'hidden';
    };

    const closeChartModal = () => {
        setIsChartModalOpen(false);
        document.body.style.overflowY = 'auto';
    };

    // Firebase
    const storage = getStorage();
    const listRef = ref(storage, 'images/');

    useEffect(() => {
        // Firebase 데이터 불러오기
        listAll(listRef)
            .then((res) => {
                const urlPromises = res.items.map((itemRef) =>
                    getDownloadURL(itemRef)
                );

                Promise.all(urlPromises)
                    .then((urlArray) => {
                        setUrl(urlArray.reverse());
                    });
            })
            .catch((error) => {
                console.error("Error listing images: ", error);
            });
    },[]);

    useEffect(function () {
        let tempData = [];

        db.collection('daily').get().then(function (qs) {
            qs.forEach(function (doc) {
                tempData.push(doc.data());
            });

            tempData.reverse();
            setData(tempData);

            const totalScore = tempData.reduce((sum, item) => sum + (item.score ? parseInt(item.score, 10) : 0), 0);
            const avgScore = tempData.length > 0 ? (totalScore / tempData.length).toFixed(0) : 0;
            setAverageScore(avgScore);

            // 차트에 사용할 데이터 준비
            const scores = tempData.map(item => item.score ? parseInt(item.score, 10) : 0);
            const labels = tempData.map(item => item.title || `No Title`);

            const combinedData = scores.map((score, index) => ({ score, label: labels[index] }));
            combinedData.sort((a, b) => a.score - b.score);
            const sortedScores = combinedData.map(item => item.score);
            const sortedLabels = combinedData.map(item => item.label);

            // Chart.js에서 사용할 데이터 객체 생성
            setChartData({
                labels: sortedLabels,
                datasets: [
                    {
                        label: '감정 점수',
                        data: sortedScores,
                        backgroundColor: 'rgba(255, 165, 0, 0.2)',
                        borderColor: 'rgba(255, 165, 0, 1)',
                        borderWidth: 1,
                    }
                ]
            });
        });
    }, []);

    return (
        <Wrapper>
            <FunctionBtn>
                <div onClick={() => { navigate('/') }}>
                    <WriteButtonF buttonName="처음으로"></WriteButtonF>
                </div>

                <div onClick={openModal}>
                    <WriteButtonUF buttonName="이게 뭐하는거에요?"></WriteButtonUF>
                </div>

                {/* 차트 모달 열기 버튼 */}
                <div onClick={openChartModal}>
                    <WriteButtonUF buttonName="관람객 감정 점수 분포 보기"></WriteButtonUF>
                </div>
            </FunctionBtn>

            <TitleFrame>
                <Title text={<>관람객의 평균 감정 점수는 <HighlightedScore>{averageScore}</HighlightedScore>점입니다.</>}></Title>
            </TitleFrame>

            <DivideLine></DivideLine>

            <ContentsFrame>
                <DailyList imgUrl={url} posts={data} onClickItem={(p) => { navigate('/post/' + p.id) }}></DailyList>
            </ContentsFrame>

            {/* 차트 모달 */}
            {isChartModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h2 style={{ color: 'white', marginBottom: '20px' }}>감정 점수 분포 차트</h2>
                        {chartData ? (
                            <div style={{ width: '100%', marginBottom: '20px' }}>
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            title: {
                                                display: true,
                                                text: '관람객들의 점수 분포입니다. 본인의 점수와 비교해보세요.',
                                                color: 'white',
                                                font: {
                                                    size: 16,
                                                    weight: 400,
                                                },
                                            },
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: 'white',
                                                },
                                            },
                                            y: {
                                                ticks: {
                                                    color: 'white',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <p style={{ color: 'white' }}>차트 데이터를 불러오는 중...</p>
                        )}

                        <div onClick={closeChartModal}>
                            <WriteButtonUF buttonName="닫기" />
                        </div>

                    </ModalContent>
                </ModalOverlay>
            )}

            {/* 팝업이 열려 있을 때만 오버레이와 모달을 표시 */}
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>모든 기록을 볼 수 있는 페이지입니다.</ModalTitle>
                        <ModalParagraph>일기를 작성했던 관람객들과의 내 감정 점수를 비교해볼 수 있으며,</ModalParagraph>
                        <ModalParagraph>내가 작성한 일기를 확인하고, 타로 카드를 뽑을 수 있습니다.</ModalParagraph>
                        <ModalCheck onClick={closeModal}>
                            <WriteButtonUF buttonName="확인했어요">확인했어요</WriteButtonUF>
                        </ModalCheck>

                    </ModalContent>
                </ModalOverlay>
            )}
        </Wrapper>
    );
}

export default ViewDaily;