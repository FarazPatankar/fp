import {
  useEditor as useTiptapEditor,
  EditorContent,
  BubbleMenu,
  Extensions,
  PureEditorContent,
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

const content = "<p>Hello World!</p>";

export const useEditor = () => {
  const editor = useTiptapEditor({
    extensions,
    content,
  });

  return editor;
};

const Tiptap = () => {
  const editor = useEditor();
  const editorRef = useRef<PureEditorContent | null>(null);

  if (!editor) {
    return null;
  }

  const onSave = () => {
    console.log("onSave", {
      html: editor.getHTML(),
      json: editor.getJSON(),
    });
  };

  return (
    <>
      <Flex width="100%" direction="row" align="center" justify="between">
        <Text size="6" weight="bold">
          Scratchpad
        </Text>
        <Button type="button" onClick={onSave}>
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
