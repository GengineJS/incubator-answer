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

import { useEffect, useRef, useState, memo } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Select from '../Select';
import ToolItem from '../toolItem';
import { IEditorContext } from '../types';

const codeLanguageType = [
  'bash',
  'sh',
  'zsh',
  'c',
  'h',
  'cpp',
  'hpp',
  'c++',
  'h++',
  'cc',
  'hh',
  'cxx',
  'hxx',
  'c-like',
  'cs',
  'csharp',
  'c#',
  'clojure',
  'clj',
  'coffee',
  'coffeescript',
  'cson',
  'iced',
  'css',
  'dart',
  'erl',
  'erlang',
  'go',
  'golang',
  'hs',
  'haskell',
  'html',
  'xml',
  'xsl',
  'xhtml',
  'rss',
  'atom',
  'xjb',
  'xsd',
  'plist',
  'wsf',
  'svg',
  'http',
  'https',
  'ini',
  'toml',
  'java',
  'jsp',
  'js',
  'javascript',
  'jsx',
  'mjs',
  'cjs',
  'json',
  'kotlin',
  'kt',
  'latex',
  'tex',
  'less',
  'lisp',
  'lua',
  'makefile',
  'mk',
  'mak',
  'markdown',
  'md',
  'mkdown',
  'mkd',
  'matlab',
  'objectivec',
  'mm',
  'objc',
  'obj-c',
  'ocaml',
  'ml',
  'pascal',
  'delphi',
  'dpr',
  'dfm',
  'pas',
  'freepascal',
  'lazarus',
  'lpr',
  'lfm',
  'pl',
  'perl',
  'pm',
  'php',
  'php3',
  'php4',
  'php5',
  'php6',
  'php7',
  'php-template',
  'protobuf',
  'py',
  'python',
  'gyp',
  'ipython',
  'r',
  'rb',
  'ruby',
  'gemspec',
  'podspec',
  'thor',
  'irb',
  'rs',
  'rust',
  'scala',
  'scheme',
  'scss',
  'shell',
  'console',
  'sql',
  'swift',
  'typescript',
  'ts',
  'vhdl',
  'vbnet',
  'vb',
  'shadertoy',
  'glsl',
  'yaml',
  'yml',
];
const mainImgFunc =
  `void mainImage(out vec4 fragColor, in vec2 fragCoord) {\n` +
  `    // Normalized pixel coordinates (from 0 to 1)\n` +
  `    vec2 uv = fragCoord/iResolution.xy;\n\n` +
  `    // Time varying pixel color\n` +
  `    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));\n\n` +
  `    // Output to screen\n` +
  `    fragColor = vec4(col,1.0);\n` +
  `}`;
const glslTemplate =
  `#ifdef GL_ES\n` +
  `  precision mediump float;\n` +
  `#endif\n` +
  `uniform vec2 u_resolution;\n` +
  `uniform vec2 u_mouse;\n` +
  `uniform float u_time;\n` +
  `uniform vec4 u_date;\n` +
  `uniform float u_delta;\n` +
  `void main() {\n` +
  `    vec2 st = gl_FragCoord.xy/u_resolution.xy;\n` +
  `    st.x *= u_resolution.x/u_resolution.y;\n` +
  `    vec3 color = vec3(0.);\n` +
  `    color = vec3(st.x,st.y,abs(sin(u_time)));\n` +
  `    gl_FragColor = vec4(color,1.0);\n` +
  `}`;

const mainImgRegex = /void\s+mainImage\s*\(([^)]*)\)\s*\{[^]*\}/g;
let context: IEditorContext;
const Code = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'editor' });
  const item = {
    label: 'code',
    keyMap: ['Ctrl-k'],
    tip: `${t('code.text')} (Ctrl+k)`,
  };

  const [code, setCode] = useState({
    value: '',
    isInvalid: false,
    errorMsg: '',
  });
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const SINGLELINEMAXLENGTH = 40;
  const addCode = (ctx) => {
    context = ctx;
    const { wrapText, editor } = context;

    const text = context.editor.getSelection();

    if (!text) {
      setVisible(true);

      return;
    }
    if (text.length > SINGLELINEMAXLENGTH) {
      context.wrapText('```\n', '\n```');
    } else {
      wrapText('`', '`');
    }
    editor.focus();
  };

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleClick = () => {
    if (!code.value.trim()) {
      setCode({
        ...code,
        errorMsg: t('code.form.fields.code.msg.empty'),
        isInvalid: true,
      });
      return;
    }

    let value;

    if (
      code.value.split('\n').length > 1 ||
      code.value.length >= SINGLELINEMAXLENGTH
    ) {
      let currLang = lang;
      const lowerLang = lang.toLowerCase();
      if (lowerLang === 'glsl' || lowerLang === 'shadertoy') {
        currLang = lowerLang;
        if (currLang === 'shadertoy' && !code.value.match(mainImgRegex)) {
          setCode({
            ...code,
            value: `${code.value}
          ${mainImgFunc}`,
          });
        }
      }
      value = `\n\`\`\`${currLang}\n${code.value}\n\`\`\`\n`;
    } else {
      value = `\`${code.value}\``;
    }
    context.editor.replaceSelection(value);
    setCode({
      value: '',
      isInvalid: false,
      errorMsg: '',
    });
    setLang('');
    setVisible(false);
  };
  const onHide = () => setVisible(false);
  const onExited = () => context.editor?.focus();
  return (
    <ToolItem {...item} onClick={addCode}>
      <Modal
        show={visible}
        onHide={onHide}
        onExited={onExited}
        fullscreen="sm-down">
        <Modal.Header closeButton>
          <h5 className="mb-0">{t('code.add_code')}</h5>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editor.code" className="mb-3">
            <Form.Label>{t('code.form.fields.code.label')}</Form.Label>
            <Form.Control
              ref={inputRef}
              as="textarea"
              rows={3}
              value={code.value}
              isInvalid={code.isInvalid}
              className="font-monospace"
              style={{ height: '200px' }}
              onChange={(e) => setCode({ ...code, value: e.target.value })}
            />
            {code.isInvalid && (
              <Form.Control.Feedback type="invalid">
                {code.errorMsg}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId="editor.codeLanguageType" className="mb-3">
            <Form.Label>{`${t('code.form.fields.language.label')} ${t(
              'optional',
              {
                keyPrefix: 'form',
              },
            )}`}</Form.Label>
            <Select
              options={codeLanguageType}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              onSelect={(val) => {
                setLang(val);
                const isEmptyCode = code.value.trim() === '';
                if (val === 'shadertoy' && !code.value.match(mainImgRegex)) {
                  setCode({
                    value: isEmptyCode
                      ? mainImgFunc
                      : `${code.value}
                    ${mainImgFunc}`,
                    isInvalid: false,
                    errorMsg: '',
                  });
                } else if (val === 'glsl' && isEmptyCode) {
                  setCode({
                    value: glslTemplate,
                    isInvalid: false,
                    errorMsg: '',
                  });
                }
              }}
              placeholder={t('code.form.fields.language.placeholder')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => {
              setVisible(false);
              setCode({
                value: '',
                isInvalid: false,
                errorMsg: '',
              });
            }}>
            {t('code.btn_cancel')}
          </Button>
          <Button variant="primary" onClick={handleClick}>
            {t('code.btn_confirm')}
          </Button>
        </Modal.Footer>
      </Modal>
    </ToolItem>
  );
};

export default memo(Code);
