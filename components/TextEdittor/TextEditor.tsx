import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    // Initialize Quill editor if it hasn't been initialized yet
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            [{ align: [] }],
            ['code-block'],
            ['clean'],
          ],
        },
      });

      // Set initial content for Quill editor
      if (quillRef.current) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for changes and propagate them back to the parent
      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }

    // Only set new value if it's different from the current content
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value, onChange]);

  return <div ref={editorRef}></div>;
};

export default TextEditor;
