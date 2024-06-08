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
import { Box, Button, Flex, Text } from "@radix-ui/themes";

// define your extension array
const extensions: Extensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Start writing..." }),
];

interface EditorProps {
  content: Content;
}
export const useEditor = ({ content }: EditorProps) => {
  const editor = useTiptapEditor({
    extensions,
    content,
  });

  return editor;
};

interface TiptapProps extends EditorProps {
  onSave: (html: string) => void;
}
const Tiptap = ({ content, onSave }: TiptapProps) => {
  const editor = useEditor({ content });
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
      <Flex width="100%" direction="row" align="center" justify="between">
        <Text size="6" weight="bold">
          Scratchpad
        </Text>
        <Button type="button" onClick={onClickSave}>
          Save
        </Button>
      </Flex>
      <Box width="100%">
        <EditorContent editor={editor} ref={editorRef} />
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </Box>
    </>
  );
};

export default Tiptap;
