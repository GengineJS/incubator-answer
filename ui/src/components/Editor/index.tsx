/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { forwardRef, ForwardRefRenderFunction, useEffect, useRef } from 'react';

// import classNames from 'classnames';
//
// import PluginRender from '../PluginRender';
//
// import {
//   BlockQuote,
//   Bold,
//   Code,
//   Heading,
//   Help,
//   Hr,
//   Image,
//   Indent,
//   Italice,
//   Link as LinkItem,
//   OL,
//   Outdent,
//   Table,
//   UL,
// } from './ToolBars';
// eslint-disable-next-line import/order
import { htmlRender } from './utils';
// import Viewer from './Viewer';
// import { EditorContext } from './EditorContext';
import './index.scss';
// eslint-disable-next-line import/order
import {
  appendSingleResources,
  getTargetRootAssetBunHost,
  isLightTheme,
} from '@/common/functions';
import { loggedUserInfoStore } from '@/stores';
// import UploadManager from '@/components/Editor/upload_manager';
// import { PolicyType, TaskType } from '@/components/Editor/types';
// import { getFileLink } from '@/components/Editor/api';

export interface EditorRef {
  getHtml: () => string;
}

interface EventRef {
  onChange?(value: string): void;
  onFocus?(): void;
  onBlur?(): void;
}

interface Props extends EventRef {
  editorPlaceholder?;
  className?;
  value;
  autoFocus?: boolean;
  cacheKey;
}

/* const preventDefaultEve = (eve) => {
  eve.preventDefault();
}; */
// const formulaSvg =
//   '<svg viewBox="0 0 24 24" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>formula_fill</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Editor" transform="translate(-480.000000, -144.000000)"> <g id="formula_fill" transform="translate(480.000000, 144.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M4.5,4.5 C4.5,3.39543 5.39543,2.5 6.5,2.5 L17.5,2.5 C18.6046,2.5 19.5,3.39543 19.5,4.5 L19.5,5 C19.5,5.82843 18.8284,6.5 18,6.5 C17.3469,6.5 16.7913,6.0826 16.5854,5.5 L7.72155,5.5 L13.8876,10.7852 C14.6326,11.4237 14.6326,12.5763 13.8876,13.2148 L7.72155,18.5 L16.5854,18.5 C16.7913,17.9174 17.3469,17.5 18,17.5 C18.8284,17.5 19.5,18.1716 19.5,19 L19.5,19.5 C19.5,20.6046 18.6046,21.5 17.5,21.5 L6.5,21.5 C5.39543,21.5 4.5,20.6046 4.5,19.5 L4.5,18.23 C4.5,17.6461 4.75512,17.0914 5.19842,16.7115 L10.6951,12 L5.19842,7.28855 C4.75513,6.90858 4.5,6.35388 4.5,5.77003 L4.5,4.5 Z" id="路径" fill="#6e6e6e"></path></g></g></g>';
const MDEditor: ForwardRefRenderFunction<EditorRef, Props> = (
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editorPlaceholder = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    className = '',
    value,
    onChange,
    onFocus,
    onBlur,
    cacheKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoFocus = false,
  },
  ref,
) => {
  // const editorRef = useRef<HTMLDivElement>(null);
  // const previewRef = useRef<{ getHtml; element } | null>(null);
  const vditorRef = useRef(null);
  // const editor = useEditor({
  //   editorRef,
  //   onChange,
  //   onFocus,
  //   onBlur,
  //   placeholder: editorPlaceholder,
  //   autoFocus,
  // });
  const vditorContainerRef = useRef<HTMLDivElement>(null);
  // const [isVditorLoaded, setIsVditorLoaded] = useState(false); // 跟踪 Vditor 是否已经加载完成
  // const [content, setContent] = useState('');
  // const getHtml = () => {
  //   return previewRef.current?.getHtml();
  // };
  const { user: storeUser } = loggedUserInfoStore((_) => _);

  // useImperativeHandle(ref, () => ({
  //   getHtml,
  // }));
  // const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currVal = value;
    // @ts-ignore
    const { current } = vditorRef;
    if (current) {
      if (cacheKey) {
        // currVal = localStorage.getItem(cacheKey) || '';
        // @ts-ignore
        current!.vditor.options.cache.id = cacheKey;
      }
      const storageVal = localStorage.getItem(cacheKey);
      // @ts-ignore
      if (!storageVal) {
        // @ts-ignore
        current.setValue(currVal || '');
      }
      return;
    }
    appendSingleResources(
      'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.css',
      'https://cdn.jsdelivr.net/npm/vditor@3.10.8/dist/index.min.js',
      function onload(scriptEle) {
        let isFirst = true;
        // 可能会在不刷新页面的情况下又重新进入了页面，会导致不渲染了，所以得hack下
        document.head.removeChild(scriptEle);
        const height = '400px';
        const top = '60px';
        // @ts-ignore
        // const uploadManager = new UploadManager({ concurrentLimit: 5 });
        // @ts-ignore
        const vditor = new Vditor('vditor', {
          cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.10.8',
          height,
          mode: 'wysiwyg',
          toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'line',
            'quote',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            'code',
            'inline-code',
            'undo',
            'redo',
            'upload',

            'table',
            'edit-mode',
            'both',
            'preview',
            'outline',
            {
              name: 'fullscreen',
              click() {
                const { style } = vditorContainerRef.current!;
                // fullscreen
                if (style.top === top) {
                  style.top = '0px';
                  style.height = height;
                } else {
                  style.top = top;
                  const containerHeight =
                    vditorContainerRef.current!.getBoundingClientRect().height;
                  const adjustedHeight = containerHeight - 60;
                  style.setProperty(
                    'height',
                    `${adjustedHeight}px`,
                    'important',
                  );
                }
              },
            },
            'export',
          ],
          counter: {
            enable: true,
          },
          theme: isLightTheme() ? 'classic' : 'dark',
          cache: {
            enable: true,
            id: cacheKey,
          },
          upload: {
            accept:
              '.rar, .zip, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, .doc, .docx, .txt, .pdf, .xls, .xlsx, .ppt, .pptx, audio/*, video/*, image/*, media_type', // 'image/*,.mp3, .wav, .rar, .mp4'
            token: 'test',
            url: '/answer/api/v1/file',
            linkToImgUrl: '/answer/api/v1/file',
            multiple: false,
            extraData: {
              source: 'post',
              isVditor: true,
              name: '',
            },
            // success(editor: HTMLPreElement, msg: string) {
            //   console.log(editor, msg);
            //   const msgObj = JSON.parse(msg);
            //   if (msgObj.code === 0) {
            //     // const currData = msgObj.data;
            //   }
            // },
            filename(name) {
              const filename = name
                .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g, '')
                .replace(/[?\\/:|<>*[\]()$%{}@~]/g, '')
                .replace('/\\s/g', '');
              return filename;
            },
            async file(files) {
              // eslint-disable-next-line prefer-destructuring
              const extraData =
                // @ts-ignore
                vditorRef.current!.vditor.options.upload.extraData;
              // eslint-disable-next-line prefer-destructuring,no-multi-assign
              const file = (extraData.file = files[0]);
              let fileName = file.name;
              // 如果是image.png，大概率是截图直接上传的，应该给个唯一标识
              if (file.name === 'image.png') {
                const uniqueIdentifier = Date.now(); // 获取当前时间的毫秒时间戳
                const filenameParts = file.name.split('.'); // 将文件名按“.”分割成数组
                const newFilename = `${filenameParts[0]}_${uniqueIdentifier}.${filenameParts[1]}`; // 重新组合文件名
                fileName = newFilename; // 更新文件名
              }
              extraData.name = fileName;
              extraData.path = '/点识成金AI';
              extraData.tag = '点识成金AI';
              extraData.host = getTargetRootAssetBunHost();
              extraData.userName = storeUser.display_name;
              extraData.watermark = true;
              // 图像最大宽度
              extraData.maxWidth = 800;
              return files;
            },
          },
          lang: storeUser.language !== 'en_US' ? 'zh_CN' : 'en_US',
          // 监听编辑器失去焦点时的事件
          blur: () => {
            if (onBlur) {
              onBlur();
            }
          },

          // 监听编辑器内容发生变化时的事件
          input: (editorValue) => {
            if (onChange) {
              onChange(editorValue);
            }
            // 你可以在这里执行保存内容或其他操作
          },
          // 监听编辑器获得焦点时的事件
          focus: () => {
            if (onFocus) {
              onFocus();
            }
          },
          // currStr是storage获取出来的，但是此时cacheKey是空字符串，所以并不准确
          after: (currStr: string) => {
            vditorRef.current = vditor;
            if (cacheKey) {
              currStr = localStorage.getItem(cacheKey) || '';
              if (onChange) {
                onChange(currStr);
              }
              vditor.vditor.options.cache.id = cacheKey;
            }
            if (isFirst) {
              isFirst = false;
              if (currStr) {
                vditor.setValue(currStr);
                return;
              }
            }
            if (!currStr) {
              vditor.setValue(currVal);
            }
          },
        });
      },
      true,
      false,
    );
  }, [ref, value /* , isVditorLoaded */]);
  return (
    <div
      ref={vditorContainerRef}
      // style={style}
      id="vditor"
      className="vditor fmt"
    />
  );
};
export { htmlRender };
export default forwardRef(MDEditor);
