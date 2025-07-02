import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";

import { BubbleMenu } from "./bubble-menu";

export default () => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: `
      <p>Hello World</p>
    `,
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none",
      },
    },
  });

  return (
    <>
      {editor && <BubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
};
