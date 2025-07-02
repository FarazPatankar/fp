import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu as BubbleMenuComponent } from "@tiptap/react/menus";
import { cn } from "~/lib/utils";

const BubbleMenuItem = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-1 px-2 hover:bg-muted",
        isActive
          ? "text-primary hover:text-muted-foreground font-medium"
          : "text-muted-foreground hover:text-primary",
      )}
    >
      {children}
    </button>
  );
};

export const BubbleMenu = ({ editor }: { editor: Editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isUnderline: editor.isActive("underline"),
        isStrike: editor.isActive("strike"),
      };
    },
  });

  return (
    <BubbleMenuComponent
      editor={editor}
      shouldShow={({ editor, state }) => {
        if (!editor.isEditable) {
          return false;
        }

        if (state.selection.empty) {
          return false;
        }

        return true;
      }}
      className={cn(
        "flex",
        "bg-popover border border-muted rounded-md text-muted-foreground",
      )}
    >
      <BubbleMenuItem
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={state.isBold}
      >
        B
      </BubbleMenuItem>
      <BubbleMenuItem
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={state.isItalic}
      >
        I
      </BubbleMenuItem>
      <BubbleMenuItem
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={state.isUnderline}
      >
        U
      </BubbleMenuItem>
      <BubbleMenuItem
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={state.isStrike}
      >
        S̶
      </BubbleMenuItem>
    </BubbleMenuComponent>
  );
};
