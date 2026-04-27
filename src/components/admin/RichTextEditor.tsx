"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your article here…" }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {(
          [
            { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
            { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
            { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
            { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
            { label: "UL", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
            { label: "OL", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
            { label: "---", action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
          ] as { label: string; action: () => void; active: boolean }[]
        ).map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`px-2 py-1 text-xs rounded font-mono ${btn.active ? "bg-brand-red text-white" : "bg-white border hover:bg-gray-100"}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
