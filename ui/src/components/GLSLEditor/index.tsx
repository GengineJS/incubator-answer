import { useEffect, useRef } from 'react';

const GlslEditorComponent = ({ glslCode, className }) => {
  // 使用useRef来存储GlslEditor实例
  const glslEditorInstance = useRef(null);

  useEffect(() => {
    // 当组件挂载时初始化编辑器
    const editorElement = document.querySelector(`.${className}`);
    if (editorElement) {
      // 如果已经存在一个实例，则先清理旧实例
      // if (glslEditorInstance.current) {
      //   glslEditorInstance.current.dispose();
      // }
      editorElement.innerHTML = '';
      // 创建新的GlslEditor实例
      // @ts-ignore
      glslEditorInstance.current = new GlslEditor(editorElement, {
        canvas_size: 500,
        theme: 'monokai',
        multipleBuffers: true,
        watchHash: true,
        fileDrops: false,
        frag: glslCode,
        menu: false,
      });
    }

    // 在组件卸载时清理资源
    return () => {
      if (glslEditorInstance.current) {
        // glslEditorInstance.current.dispose();
        glslEditorInstance.current = null;
      }
    };
  }, [glslCode, className]); // 依赖于glslCode和className变化重新渲染

  return null;
};

export default GlslEditorComponent;
