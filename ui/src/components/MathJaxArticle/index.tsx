import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { MathJaxContext, MathJax } from 'better-react-mathjax';
// math jax
export const config = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  startup: {
    typeset: false,
  },
};
const MathJaxRenderer = ({ html, ref }) => {
  return (
    <MathJaxContext version={3} config={config}>
      <MathJax>
        <article
          ref={ref}
          className="fmt text-break text-wrap mt-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </MathJax>
    </MathJaxContext>
  );
};

export default MathJaxRenderer;
