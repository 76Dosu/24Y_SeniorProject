import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { getStorage, ref, uploadString } from "firebase/storage";

//ui
import Title from "../ui/Title";
import GenImage from "../ui/GenImage";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

//styled
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;   
    padding:0px 11.54%;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    text-align:center;
`

const SubText = styled.p`
    font-size:20px;
    font-weight:400;
    color:white;

    margin-top:12px;
    margin-bottom:60px;
`

const GenImageFrame = styled.div`
    display:flex;
    align-items:center;
    justify-content: space-between;

    width:100%;
    gap:24px;
`

const EntireButtonFrame = styled.div`
    display:flex;
    align-items:center;
    justify-content: center;

    margin-top:60px;    
`

const WriteButtonFrame = styled.div`
    display:flex;
    width:fit-content;

    margin-right:20px;

    &:last-child {
        margin-right:0px;
    }
`

const InputFrame = styled.div`    
    display:flex;
    flex-direction:column;
    align-items:center;

    width:100%;
    height: fit-content;

    position:relative;
`

const Input = styled.input`
    width:fit-content;
    display:none;
`

const Label = styled.label`
    width:inherit;
    height:100%;

    position:absolute;
    cursor:pointer;
`

const LoadingContainer = styled.div`
    width:100vw;    
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    z-index:99;
    background-color:rgba(0, 0, 0, 0.7);
    
    display:flex;
    align-items:center;
    justify-content:center;
`

const typingAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LoadingText = styled.p`
    font-size:24px;
    color:white;
    display: inline-block;
    span {
        display: inline-block;
        opacity: 0;
        animation: ${typingAnimation} 2s infinite;
        animation-delay: calc(0.1s * var(--i));
    }
`;

// 팝업 스타일
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

function ChoicePicture() {

    const navigate = useNavigate();
    const location = useLocation();

    // firebase
    const storage = getStorage();
    const storageRef = ref(storage, `images/${location.state.timestamp}`);
    const [isLoading, setIsLoading] = useState(false);

    // 이미지 생성
    const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    const [imageUrlA, setImageUrlA] = useState('');
    const [imageUrlB, setImageUrlB] = useState('');
    const [imageUrlC, setImageUrlC] = useState('');

    const base64ToBase64url = (base64) => {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const generateImage = useCallback(async (style) => {
        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GPT_API_KEY}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: `${location.state.results}를 대표하는 그림을 ${style} 스타일로 컷 없이 한 장으로 그려줘`,
                    n: 1,
                    size: '1024x1024',
                    response_format: "b64_json",
                })
            });

            // DALLE-3 이미지 URL
            const data = await response.json();

            return `data:image/jpeg;base64,${data.data[0].b64_json}`
        } catch (error) {
            console.error('Error generating image:', error);
            throw new Error('Image generation failed');
        }
    }, [location.state.results, GPT_API_KEY]);

    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);

            const [base64A, base64B, base64C] = await Promise.all([
                generateImage('사실적인'),
                generateImage('일러스트'),
                generateImage('창의적인')
            ]);

            setImageUrlA(base64A);
            setImageUrlB(base64B);
            setImageUrlC(base64C);

            setChoosedImageUrl(base64B);
            setIsLoading(false);  // 모든 이미지가 로드된 후 로딩 상태를 해제
        };

        loadImages();

    }, [generateImage]);

    // 팝업 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 선택 이미지 콘솔찍기
    const [choosedImageUrl, setChoosedImageUrl] = useState(imageUrlB);

    const imageClick = (url) => {
        return () => {
            setChoosedImageUrl(url);
        };
    };

    const SubmitImage = async () => {
        try {
            const base64WithoutPrefix = choosedImageUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
            const base64urlChoosedImage = base64ToBase64url(base64WithoutPrefix);

            await uploadString(storageRef, base64urlChoosedImage, 'base64url');
            navigate(`/post/${location.state.timestamp}`);


        } catch (error) {
            console.error("Error submitting image:", error);
        }
    };

    const loadingText = "이미지를 생성 중입니다.";
    const animatedLoadingText = loadingText.split("").map((char, index) => (
        <span key={index} style={{ "--i": index }}>{char === " " ? "\u00A0" : char}</span>
    ));

    return (

        <div>
            {
                isLoading === true

                    ?

                    <Wrapper>

                        <LoadingContainer>
                            <LoadingText>{animatedLoadingText}</LoadingText>
                        </LoadingContainer>

                        <TitleFrame>
                            <Title text="등록할 대표 이미지를 선택하세요." />
                            <SubText>작성한 일기를 바탕으로 생성된 이미지입니다.</SubText>
                        </TitleFrame>

                        <GenImageFrame>
                            <InputFrame onClick={imageClick(imageUrlA)}>
                                <GenImage imgURL={imageUrlA} isSelected={choosedImageUrl === imageUrlA} />
                                <Label htmlFor="imgA"></Label>
                                <Input name="img" id="imgA" value={imageUrlA} type="radio" />
                            </InputFrame>

                            <InputFrame onClick={imageClick(imageUrlB)}>
                                <GenImage imgURL={imageUrlB} isSelected={choosedImageUrl === imageUrlB} />
                                <Label htmlFor="imgB"></Label>
                                <Input name="img" id="imgB" value={imageUrlB} type="radio" />
                            </InputFrame>

                            <InputFrame onClick={imageClick(imageUrlC)}>
                                <GenImage imgURL={imageUrlC} isSelected={choosedImageUrl === imageUrlC} />
                                <Label htmlFor="imgC"></Label>
                                <Input name="img" id="imgC" value={imageUrlC} type="radio" />
                            </InputFrame>
                        </GenImageFrame>

                        <EntireButtonFrame>
                            <WriteButtonFrame onClick={openModal}>
                                <WriteButtonUF buttonName="이미지는 어디에 쓰이나요?" />
                            </WriteButtonFrame>

                            <WriteButtonFrame onClick={SubmitImage}>
                                <WriteButtonF buttonName="다음으로" />
                            </WriteButtonFrame>
                        </EntireButtonFrame>
                    </Wrapper>

                    :

                    <Wrapper>

                        <TitleFrame>
                            <Title text="등록할 대표 이미지를 선택하세요." />
                            <SubText>작성한 일기를 바탕으로 생성된 이미지입니다.</SubText>
                        </TitleFrame>

                        <GenImageFrame>
                            <InputFrame onClick={imageClick(imageUrlA)}>
                                <GenImage imgURL={imageUrlA} isSelected={choosedImageUrl === imageUrlA} />
                                <Label htmlFor="imgA"></Label>
                                <Input name="img" id="imgA" value={imageUrlA} type="radio" />
                            </InputFrame>

                            <InputFrame onClick={imageClick(imageUrlB)}>
                                <GenImage imgURL={imageUrlB} isSelected={choosedImageUrl === imageUrlB} />
                                <Label htmlFor="imgB"></Label>
                                <Input name="img" id="imgB" value={imageUrlB} type="radio" />
                            </InputFrame>

                            <InputFrame onClick={imageClick(imageUrlC)}>
                                <GenImage imgURL={imageUrlC} isSelected={choosedImageUrl === imageUrlC} />
                                <Label htmlFor="imgC"></Label>
                                <Input name="img" id="imgC" value={imageUrlC} type="radio" />
                            </InputFrame>
                        </GenImageFrame>

                        <EntireButtonFrame>
                            <WriteButtonFrame onClick={openModal}>
                                <WriteButtonUF buttonName="이미지는 어디에 쓰이나요?" />
                            </WriteButtonFrame>

                            <WriteButtonFrame onClick={SubmitImage}>
                                <WriteButtonF buttonName="다음으로" />
                            </WriteButtonFrame>
                        </EntireButtonFrame>

                        {/* 팝업이 열려 있을 때만 오버레이와 모달을 표시 */}
                        {isModalOpen && (
                            <ModalOverlay>
                                <ModalContent>
                                    <ModalTitle>대표 이미지를 선택해보세요.</ModalTitle>
                                    <ModalParagraph>선택한 이미지는 작성한 일기를 대표합니다.</ModalParagraph>
                                    <ModalParagraph>또한, 일기로 생성되는 타로의 대표 이미지로도 사용됩니다.</ModalParagraph>
                                    <ModalCheck onClick={closeModal}>
                                        <WriteButtonUF buttonName="확인했어요">확인했어요</WriteButtonUF>
                                    </ModalCheck>

                                </ModalContent>
                            </ModalOverlay>
                        )}

                    </Wrapper>

            }
        </div>
    );

}

export default ChoicePicture;