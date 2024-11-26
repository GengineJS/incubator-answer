import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  memo,
  useImperativeHandle,
} from 'react';

import { MathJaxContext, MathJax } from 'better-react-mathjax';

import { markdownToHtml } from '@/services';
import ImgViewer from '@/components/ImgViewer';
import { config } from '../MathJaxArticle';

import { htmlRender } from './utils';

let scrollTop = 0;
let renderTimer;

const Index = ({ value }, ref) => {
  const [html, setHtml] = useState('');
  const [isMathJaxReady, setIsMathJaxReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const renderMarkdown = (markdown) => {
    clearTimeout(renderTimer);
    const timeout = renderTimer ? 1000 : 0;
    renderTimer = setTimeout(() => {
      markdownToHtml(markdown).then((resp) => {
        scrollTop = previewRef.current?.scrollTop || 0;
        setHtml(resp);
      });
    }, timeout);
  };

  useEffect(() => {
    setIsMathJaxReady(false);
    renderMarkdown(value);
  }, [value]);

  useEffect(() => {
    if (!html) {
      return;
    }

    previewRef.current?.scrollTo(0, scrollTop);

    // 在HTML内容加载完成后，调用MathJax的typeset方法重新渲染公式
    if (previewRef.current) {
      htmlRender(previewRef.current);
      setIsMathJaxReady(true); // 设置MathJax准备好
    }
  }, [html]);

  useImperativeHandle(ref, () => ({
    getHtml: () => html,
    element: previewRef.current,
  }));

  return (
    <div>
      {!isMathJaxReady ? (
        <div
          ref={previewRef}
          className="preview-wrap position-relative p-3 bg-light rounded text-break text-wrap mt-2 fmt"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <MathJaxContext version={3} config={config}>
          <MathJax>
            <ImgViewer>
              <div
                ref={previewRef}
                className="preview-wrap position-relative p-3 bg-light rounded text-break text-wrap mt-2 fmt"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </ImgViewer>
          </MathJax>
        </MathJaxContext>
      )}
    </div>
  );
};

export default memo(forwardRef(Index));
