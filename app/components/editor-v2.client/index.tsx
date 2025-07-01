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
  });

  return <EditorContent editor={editor} />;
};
