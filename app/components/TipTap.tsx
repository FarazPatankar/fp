import {
  useEditor as useTiptapEditor,
  EditorContent,
  BubbleMenu,
  Extensions,
  PureEditorContent,
  Content,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";

// define your extension array
const extensions: Extensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Start writing..." }),
];

interface EditorProps {
  content: Content;
  editable?: boolean;
}
export const useEditor = ({ content, editable = false }: EditorProps) => {
  const editor = useTiptapEditor({
    extensions,
    content,
    editable,
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert",
      },
    },
  });

  return editor;
};

interface TiptapProps extends EditorProps {
  onSave: (html: string) => void;
}
const Tiptap = ({ onSave, ...args }: TiptapProps) => {
  const editor = useEditor(args);
  const editorRef = useRef<PureEditorContent | null>(null);

  if (!editor) {
    return null;
  }

  const onClickSave = () => {
    console.log("onSave", {
      html: editor.getHTML(),
      json: editor.getJSON(),
    });

    onSave(editor.getHTML());
  };

  return (
    <>
      <EditorContent editor={editor} ref={editorRef} />
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  );
};

export default Tiptap;
