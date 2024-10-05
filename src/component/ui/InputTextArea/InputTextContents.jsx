import React, { useRef } from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
    width:100%;
    min-height:300px;
    max-height:300px;
    overflow-y: scroll;
    resize:none;
    margin:24px 12px;

    border:none;
    border-radius: 8px;
    
    font-size:16px;
    font-weight:400;
    line-height:1.6;
    color:#DDDDDD;
    background-color:transparent;

    scrollbar-width: none;

    &:focus {
        outline: none; /* 기본 브라우저 아웃라인 제거 */
        border: none; /* 원하는 포커스 스타일 추가 */
        background-color: none;
    }
`

function InputTextContents(props) {

    const { value, onChange } = props;

    const inputTag = useRef(null);
    const longerTextArea = (event, tag) => {
        if (event.keyCode === 13 || 8) {
            tag.current.style.height = `auto`;
            tag.current.style.height = `${inputTag.current.scrollHeight}px`;
        }
    };

    return (
        <StyledTextArea onChange={onChange} ref={inputTag} placeholder={"ex) 오늘은 졸업 전시회날이다. 친한 친구가 졸업한다고 해서 구경왔는데 다들 멋지게 잘 한 것 같다. 전시회가 끝나고 친한 친구와 맥주 한 잔 하러 갈 예정이다. 일기를 쓰면 감정을 분석 해주고, 타로 카드를 만들어준다니 신기하다."} value={value} onKeyUp={(event) => longerTextArea(event, inputTag)}></StyledTextArea>
    )

}

export default InputTextContents;