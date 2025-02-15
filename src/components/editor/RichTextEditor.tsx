import React, { useEffect, useRef } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ initialValue = '', onChange, readOnly = false }: RichTextEditorProps) => {
  const { quill, quillRef } = useQuill({
    readOnly,
    theme: readOnly ? 'bubble' : 'snow',
    modules: readOnly ? {
      toolbar: false
    } : {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean', 'image']
      ]
    }
  });
  const isInitialized = useRef(false);

  useEffect(() => {
    if (quill && !isInitialized.current) {
      if (initialValue) {
        quill.root.innerHTML = initialValue;
      }
      isInitialized.current = true;

      if (!readOnly) {
        quill.on('text-change', () => {
          const html = quill.root.innerHTML;
          if (html !== initialValue) {
            onChange?.(html);
          }
        });
      }
    }
  }, [quill, initialValue, onChange, readOnly]);

  return (
    <div style={{ 
      width: '100%', 
      height: readOnly ? 'auto' : 200, 
      marginBottom: readOnly ? '1rem' : '4rem'
    }}>
      <div ref={quillRef} />
    </div>
  );
};

export default RichTextEditor;