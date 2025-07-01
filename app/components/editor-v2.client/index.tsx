import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default () => {
  const editor = useEditor({
    extensions: [StarterKit],
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

  return <EditorContent editor={editor} />;
};
