"use client";
import { Heading4, Heading5, List } from "lucide-react";
import { Toggle } from "../ui/toggle";
import {
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Upload,
  ListOrdered,
} from "lucide-react";

import { useUploadFileMutation } from "@/redux/service/fileupload";

import { TfiLayoutLineSolid } from "react-icons/tfi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ToolBar({ editor }: any) {
  const [uploadFile] = useUploadFileMutation();

  if (!editor) return null;

  const handleFileUpload = async (file: any) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await uploadFile({ file: formData }).unwrap();

      // Check the response structure to ensure `fullUrl` exists
      if (response?.data?.fullUrl) {
        return response.data.fullUrl; // Return the full URL
      }
    } catch {
      return ""; // Return an empty string if an error occurs
    }
  };

  const addImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e: any) => {
      const file = e.target.files ? e.target.files[0] : null;

      if (file) {
        // Upload the file and get the URL
        const fileUrl = await handleFileUpload(file);

        if (fileUrl) {
          // Insert image directly into the editor
          editor.chain().focus().setImage({ src: fileUrl }).run();
        }
      }
    };

    // Trigger file input click to open the file picker
    fileInput.click();
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
      tooltip: "Bold",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
      tooltip: "Bold",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
      tooltip: "Bold",
    },
    {
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      preesed: editor.isActive("heading", { level: 4 }),
      tooltip: "Bold",
    },
    {
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      preesed: editor.isActive("heading", { level: 5 }),
      tooltip: "Bold",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
      tooltip: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
      tooltip: "Italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
      tooltip: "Strike",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
      tooltip: "Left Align",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
      tooltip: "Center Align",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
      tooltip: "Right Align",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
      tooltip: "Ordered List",
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive("codeBlock"),
      tooltip: "Code Block",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
      tooltip: "Highlight",
    },
    {
      icon: <TfiLayoutLineSolid className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      preesed: editor.isActive("horizontalRule"),
      tooltip: "Horizontal Rule",
    },
    {
      icon: <Upload className="size-4" />,
      onClick: () => addImage(),
      preesed: editor.isActive("image"),
      tooltip: "Image",
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="border rounded-md p-1.5 mb-1 space-x-1 sticky top-10 z-50">
        {Options.map((option, i) => (
          <Toggle
            key={i}
            size="sm"
            pressed={option.preesed}
            onPressedChange={option.onClick}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{option.icon}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{option.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </Toggle>
        ))}
      </div>
    </TooltipProvider>

    // <div className="border rounded-md p-1.5 mb-1  space-x-1 sticky  top-10 z-50">
    //   {Options.map((option, i) => (
    //     <Toggle
    //       key={i}
    //       size="sm"
    //       pressed={option.preesed}
    //       onPressedChange={option.onClick}
    //       title={option.tooltip}
    //     >
    //       {option.icon}
    //     </Toggle>
    //   ))}
    // </div>
  );
}
