// eslint-disable-next-line import/order
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MathJaxContext, MathJax } from 'better-react-mathjax';

import {
  appendSingleResources,
  getDomainName,
  isLightTheme,
  isLocalHost,
} from '@/common/functions';

// math jax
export const config = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [
      ['$', '$'],
      ['(', ')'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['[', ']'],
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

const GlslRuntime = (articleRef) => {
  if (!articleRef.current) {
    return;
  }
  const codeNodes = articleRef.current.querySelectorAll('pre code');
  Array.from(codeNodes).forEach((node) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const className = node.className || '';
    const isShadertoy = className.includes('language-shadertoy');
    const isGlsl = className.includes('language-glsl');
    // @ts-ignore
    const parentNode = node.parentNode!;
    parentNode.style.padding = '0';
    if (isShadertoy || isGlsl) {
      const glslNodes = [node];
      let currTheme = '';
      if (!isLightTheme()) {
        currTheme = 'monokai';
      }

      appendSingleResources(
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
              return;
            }
            const themeLight = isLightTheme();
            parentNode.removeChild(node);
            if (themeLight) {
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
            if (isLast && themeLight) {
              const elements =
                articleRef.current.querySelectorAll('.ge_editor');
              elements.forEach((elem) => {
                elem.style.backgroundColor = '#ffffff';
              });
            }
          });
        },
        false,
        true,
      );
    }
  });
};

// function replaceSpecialChars(inputStr) {
//   // 替换 \（ 为 $
//   let replacedStr = inputStr.replace(/\\\(/g, '$');
//   // 替换 \） 为 $
//   replacedStr = replacedStr.replace(/\\\)/g, '$');
//   return replacedStr;
// }

function transformMathElements(htmlString) {
  // 创建一个新的 DOMParser 实例
  const parser = new DOMParser();
  // 解析 HTML 字符串为一个文档对象
  const doc = parser.parseFromString(htmlString, 'text/html');

  // 将 <p> 标签内的 <span class="language-math"> 替换为成对的 $ 符号
  doc.querySelectorAll('p .language-math').forEach((span) => {
    // 用 $ 包围原始内容并替换 <span>
    span.outerHTML = `$${span.textContent}$`;
  });

  // 将 <div class="language-math"> 替换为 <p> 并在内部字符串的首尾添加各两个 $$
  doc.querySelectorAll('div.language-math').forEach((div) => {
    // 创建新的 <p> 元素的内容，在原始内容前后各添加两个 $$
    const newPContent = `$$${div.innerHTML}$$`;
    // 用新的 <p> 内容替换 <div>
    div.outerHTML = `<p>${newPContent}</p>`;
  });

  // 将修改后的文档对象转换回 HTML 字符串
  return doc.body.innerHTML;
}

function renderVditor(articleRef, origin) {
  // @ts-ignore
  Vditor.preview(articleRef.current, origin, {
    cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.10.8',
    hljs: {
      lineNumber: true,
      enable: true,
    },
    icon: 'material',
    theme: {
      current: isLightTheme() ? 'light' : 'dark',
    },
    math: {
      inlineDigit: true,
      engine: 'xxx',
    },
    media: {
      enable: true,
    },
    transform(val) {
      return transformMathElements(val);
    },
    after() {
      GlslRuntime(articleRef);
      // @ts-ignore
      if (window.MathJax && typeof window.MathJax.typeset === 'function') {
        // @ts-ignore
        window.MathJax.typeset();
      }
      // window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    },
    // speech: {
    //   enable: true,
    // },
    // anchor: true,
  });
}

function extensionContent(content, replyInfo, aiTip) {
  if (replyInfo.displayName) {
    const currDomain = getDomainName();
    const isLocal = isLocalHost(currDomain);
    const url = `${isLocal ? 'http://localhost' : 'https://ai.assetbun.com'}/users/${replyInfo.userName}`;
    content = `[@${replyInfo.displayName}](${url}) ${content}`;
  }
  if (aiTip) {
    content = `${content} \`(${aiTip})\``;
  }
  return content;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MathJaxRenderer = ({
  html,
  replyUser = { userName: '', displayName: '' },
  origin = '',
  // 是否还要设置顶边距，一般为问题的主题描述
  mt4 = false,
  small = false,
  aiTip = '',
  ref,
}) => {
  // 创建内部ref
  const internalRef = useRef(null);
  // const atRef = useRef(null);
  const [isVditorLoaded, setIsVditorLoaded] = useState(false); // 跟踪 Vditor 是否已经加载完成
  let className = 'fmt text-break text-wrap'; // 'fmt text-break text-wrap'; // 'text-break text-wrap mt-4';
  if (mt4) {
    className += ' mt-4';
  }
  if (small) {
    className += '  small'; // vditor-reset--anchor' small';
  }
  // 使用React的useRef钩子来合并外部和内部的ref
  const articleRef = ref || internalRef;
  useEffect(() => {
    if (isVditorLoaded) {
      origin = extensionContent(origin, replyUser, aiTip);
      renderVditor(articleRef, origin);
      return;
    }
    if (articleRef.current) {
      appendSingleResources(
        'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.css',
        'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.js',
        function onload(scriptEle) {
          document.head.removeChild(scriptEle);
          if (origin) {
            origin = extensionContent(origin, replyUser, aiTip);
            renderVditor(articleRef, origin);
          }
          setIsVditorLoaded(true);
        },
        false,
        false,
      );
    }
  }, [html, articleRef]);
  const style = { overflow: 'hidden' };
  if (small) {
    // @ts-ignore
    style.fontSize = '.875rem';
  }
  return (
    <MathJaxContext version={3} config={config}>
      <MathJax>
        <article
          ref={articleRef}
          id="vditorPreview"
          className={className}
          dangerouslySetInnerHTML={{ __html: html }}
          style={style}
        />
      </MathJax>
    </MathJaxContext>
  );
};

export default MathJaxRenderer;
