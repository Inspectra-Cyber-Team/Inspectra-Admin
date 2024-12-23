// import { useEffect, useRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// interface TextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const quillRef = useRef<Quill | null>(null);

//   useEffect(() => {
//     // Initialize Quill editor if it hasn't been initialized yet
//     if (editorRef.current && !quillRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link"],
//             [{ color: [] }, { background: [] }],
//             [{ align: [] }],
//             ["code-block"],
//             ["clean"],
//             ["image"],
//             ["table"],
//             ["file"],
//           ],
//         },
//       });

//       // Set initial content for Quill editor
//       if (quillRef.current) {
//         quillRef.current.root.innerHTML = value;
//       }

//       // Listen for changes and propagate them back to the parent
//       quillRef.current.on("text-change", () => {
//         if (quillRef.current) {
//           onChange(quillRef.current.root.innerHTML);
//         }
//       });
//     }

//     // Only set new value if it's different from the current content
//     if (quillRef.current && quillRef.current.root.innerHTML !== value) {
//       if (quillRef.current) {
//         quillRef.current.root.innerHTML = value;
//       }
//     }
//   }, [value, onChange]);

//   return <div ref={editorRef}></div>;
// };
// export default TextEditor;

// import { useEffect, useRef } from "react";
// import Quill from "quill";
// import ImageResize from "quill-image-resize-module"; // Import the module
// import "quill/dist/quill.snow.css";

// // Register the module
// Quill.register("modules/imageResize", ImageResize);

// interface TextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const quillRef = useRef<Quill | null>(null);

//   useEffect(() => {
//     // Initialize Quill editor if it hasn't been initialized yet
//     if (editorRef.current && !quillRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link"],
//             [{ color: [] }, { background: [] }],
//             [{ align: [] }],
//             ["code-block"],
//             ["clean"],
//             ["image"],
//             ["table"],
//           ],
//           imageResize: {}, // Add the image resize module
//         },
//       });

//       // Set initial content for Quill editor
//       if (quillRef.current) {
//         quillRef.current.root.innerHTML = value;
//       }

//       // Listen for changes and propagate them back to the parent
//       quillRef.current.on("text-change", () => {
//         if (quillRef.current) {
//           onChange(quillRef.current.root.innerHTML);
//         }
//       });
//     }

//     // Only set new value if it's different from the current content
//     if (quillRef.current && quillRef.current.root.innerHTML !== value) {
//       quillRef.current.root.innerHTML = value;
//     }
//   }, [value, onChange]);

//   return <div ref={editorRef}></div>;
// };

// export default TextEditor;

"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Patch for Attributor issue
      Quill.register("modules/imageResize", ImageResize);

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["code-block"],
            ["clean"],
            ["image"],
            ["table"],
            ["file"],
          ],
          imageResize: {
            parchment: Quill.import("parchment"), // Fix for Attributor
          },
        },
      });

      // Set initial content
      if (quillRef.current) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for text changes
      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }

    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value, onChange]);

  return <div ref={editorRef}></div>;
};

export default TextEditor;
