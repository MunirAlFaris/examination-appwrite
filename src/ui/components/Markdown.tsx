import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex'
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';

export default function Markdown(props: {text: string}) {
  return (
    <div className='markdown-body' style={{backgroundColor: 'transparent'}}>
      <ReactMarkdown
        remarkPlugins={[ remarkMath, remarkGfm ]}
        rehypePlugins={[ rehypeKatex ]}
      >
        {props.text}
      </ReactMarkdown>
    </div>
  )
}