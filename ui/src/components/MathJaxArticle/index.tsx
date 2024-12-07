import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies,import/order
import { MathJaxContext, MathJax } from 'better-react-mathjax';

// eslint-disable-next-line import/no-extraneous-dependencies
import hljs from 'highlight.js/lib/core'; // 引入 core 模块
// eslint-disable-next-line import/no-extraneous-dependencies
import cpp from 'highlight.js/lib/languages/cpp';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'highlight.js/styles/default.css';

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
// SHADER TOY
const preFunction =
  // eslint-disable-next-line no-multi-str
  '\n\
#ifdef GL_ES\n\
precision mediump float;\n\
#endif\n\
\n\
#define PI 3.14159265359\n\
\n\
uniform vec2 u_resolution;\n\
uniform vec2 u_mouse;\n\
uniform float u_time;\n\
uniform float u_delta;\n\
uniform vec4 u_date;\n\
\n\
#define iResolution vec3(u_resolution.xy, 0.0)\n\
#define iTime u_time\n\
#define iTimeDelta u_delta\n\
#define iMouse vec4(u_mouse.xy, u_mouse.xy)\n\
#define iDate u_date\n\
\n';

const postFunction =
  // eslint-disable-next-line no-multi-str
  '\n\
\n\
void main(){\n\
    vec4 fragColor = vec4(1.0);\n\
    mainImage(fragColor, gl_FragCoord.xy);\n\
    gl_FragColor = fragColor;\n\
}';

const mainImgFunc =
  // eslint-disable-next-line no-multi-str
  'void mainImage(out vec4 fragColor, in vec2 fragCoord) {\n\
      // Normalized pixel coordinates (from 0 to 1)\n\
      vec2 uv = fragCoord/iResolution.xy;\n\
      // Time varying pixel color\n\
      vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));\n\
      // Output to screen\n\
      fragColor = vec4(col,1.0);\n\
  }';
const mainImgRegex = /void\s+mainImage\s*\(([^)]*)\)\s*\{[^]*\}/g;
function containsMainFunction(code) {
  // 正则表达式匹配 void main() { ... }
  const regex = /void\s+main\s*\(\s*\)\s*\{[\s\S]*?\}/g;
  return regex.test(code);
}
function unescapeHtmlEntities(escapedHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(escapedHtml, 'text/html');
  return doc.documentElement.textContent!;
}
function appendGlslEditorResources(cssUrl, scriptUrl, onLoadScript) {
  // 检查是否已经有对应的CSS文件链接
  const linkElements = document.getElementsByTagName('link');
  const existingCssLink = Array.from(linkElements).some((link) => {
    return link.href === cssUrl;
  });

  // 如果没有对应的CSS链接，则添加
  if (!existingCssLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  // 检查是否已经有对应的script标签
  const scriptElements = document.getElementsByTagName('script');
  const existingScript = Array.from(scriptElements).some((script) => {
    return script.src === scriptUrl;
  });

  // 如果没有对应的script标签，则添加
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'module'; // 如果glslEditor.min.js是一个ES6模块
    script.onload = function () {
      onLoadScript();
      // 这里可以放置脚本加载后的初始化代码
    };
    script.onerror = function () {
      console.error('glslEditor script load error.');
    };
    document.head.appendChild(script);
  } else {
    onLoadScript();
  }
}

const MathJaxRenderer = ({ html, small = false, ref }) => {
  // 创建内部ref
  const internalRef = useRef(null);
  let className = 'fmt text-break text-wrap mt-4';
  if (small) {
    className += ' small';
  }
  // 使用React的useRef钩子来合并外部和内部的ref
  const articleRef = ref || internalRef;
  useEffect(() => {
    if (articleRef.current) {
      const codeNodes = articleRef.current.querySelectorAll('pre code');
      Array.from(codeNodes).forEach((node) => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const className = node.className || '';
        const isShadertoy = className.includes('language-shadertoy');
        const isGlsl = className.includes('language-glsl');
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : '';
        // @ts-ignore
        const parentNode = node.parentNode!;
        parentNode.style.padding = '0';
        if (isShadertoy || isGlsl) {
          const glslNodes = [node];
          const htmlTag = document.querySelector('html') as HTMLHtmlElement;
          const theme = htmlTag.getAttribute('data-bs-theme');
          let currTheme = '';
          if (theme !== 'light') {
            currTheme = 'monokai';
          }

          appendGlslEditorResources(
            '/static/glslEditor.css',
            '/static/glslEditor.min.js',
            function onload() {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              glslNodes.forEach((node, index, array) => {
                // @ts-ignore
                let codeInfo = unescapeHtmlEntities(node.innerHTML);

                if (isShadertoy) {
                  if (!codeInfo.match(mainImgRegex)) {
                    codeInfo =
                      codeInfo.trim() === ''
                        ? mainImgFunc
                        : `${codeInfo}
                    ${mainImgFunc}`;
                  }
                } else if (!containsMainFunction(codeInfo)) {
                  hljs.registerLanguage(language, cpp);
                  // 如果glsl不包含main函数，就没必要通过editor解析了
                  hljs.highlightBlock(node as HTMLElement);
                  return;
                }
                parentNode.removeChild(node);
                if (theme === 'light') {
                  parentNode.style.border = `1px solid #ded7d7`;
                  parentNode.style.backgroundColor = '#f7f7f7';
                }
                const rect = parentNode.getBoundingClientRect();
                const { width } = rect;
                // @ts-ignore
                // eslint-disable-next-line no-new
                new GlslEditor(parentNode, {
                  canvas_size: width / 3,
                  theme: currTheme,
                  canvas_follow: true,
                  multipleBuffers: true,
                  watchHash: true,
                  fileDrops: false,
                  frag_footer: isShadertoy ? postFunction : '',
                  frag_header: isShadertoy ? preFunction : '',
                  frag: codeInfo,
                  autofocus: false,
                  menu: false,
                });

                const isLast = index === array.length - 1;
                if (isLast && theme === 'light') {
                  const elements =
                    articleRef.current.querySelectorAll('.ge_editor');
                  elements.forEach((elem) => {
                    elem.style.backgroundColor = '#ffffff';
                  });
                }
              });
            },
          );
        } else {
          hljs.registerLanguage(language || 'undefined', cpp);
          hljs.highlightBlock(node as HTMLElement);
        }
      });
    }
  }, [html, articleRef]);
  return (
    <MathJaxContext version={3} config={config}>
      <MathJax>
        <article
          ref={articleRef}
          className={className}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </MathJax>
    </MathJaxContext>
  );
};

export default MathJaxRenderer;
