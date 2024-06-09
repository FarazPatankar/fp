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
import { Button } from "./ui/button";

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
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
const Tiptap = ({ onSave, setIsEditing, ...args }: TiptapProps) => {
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
    /**
     * This is intentionally not using a fragment
     * https://github.com/remix-run/react-router/issues/8834#issuecomment-1118083034
     */
    <div>
      <div className="flex items-center space-x-2 absolute top-0 right-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onClickSave}>
          Save
        </Button>
      </div>

      <EditorContent editor={editor} ref={editorRef} />
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </div>
  );
};

export default Tiptap;
