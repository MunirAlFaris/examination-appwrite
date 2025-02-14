import * as React from 'react';

export default function QuestionImage(props: {imgId: string}) {
  return <img src={`https://drive.google.com/thumbnail?id=${props.imgId}&sz=w1000`} alt="img"/>
}