import React, { useEffect, useState } from 'react';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Editor styles
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css'

export default function TextEditor(props: {
  text: string;
  onChange: ({text}: {text: string}) => void;
  setText: (text: string) => void;
  height?: number;
  placeholder?: string;
}) {
  // Pass a renderHTML function that returns the text as is
  const renderMarkdown = (text: string) => (<ReactMarkdown skipHtml remarkPlugins={[ remarkMath, remarkGfm ]} rehypePlugins={[ rehypeKatex ]}>{text}</ReactMarkdown>);
  // Insert Math equation into the editor
  const insertMathEquation = () => {
    // The math equation to insert
    const mathEquation = '$f(x) = y + x^3$';
    const text = '\n' + mathEquation;
    props.setText(text)
  };
  useEffect(() => {
    const btn = document.getElementById('math-button-id');
    const nav = document.querySelector('.button-wrap');
    if(nav && ! btn) {
      const span = document.createElement('span')
      span.id = 'math-button-id'
      span.className = 'button'
      span.onclick = insertMathEquation;
      span.innerText = 'Math'
      span.style.cursor = 'pointer'
      nav.appendChild(span)
    }
  })
  return (
    <ReactMarkdownEditorLite
      value={props.text}
      onChange={props.onChange}
      renderHTML={renderMarkdown}
      style={{
        height: props.height ? `${props.height}px` : '400px',
        flex: '1'
      }}
      htmlClass='markdown-body'
      {...(props.placeholder ? {placeholder: props.placeholder} : {})}
    />
  );
}