import { Extension } from "@tiptap/core";
import { Editor, posToDOMRect, Range, ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { useEffect, useState } from "react";
import { computePosition, flip, shift } from "@floating-ui/react-dom";

const Command = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      } as SuggestionOptions,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

type SuggestionItem = {
  title: string;
  command: (props: { editor: Editor; range: Range }) => void;
};

type DropdownMenuProps = {
  items: SuggestionItem[];
  range: Range;
  editor: Editor;
};

export const CommandsList = ({ items, range, editor }: DropdownMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];
    if (!item) return;

    item.command({ editor, range });
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();

        setSelectedIndex(prev => (prev + items.length - 1) % items.length);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();

        setSelectedIndex(prev => (prev + 1) % items.length);
      } else if (event.key === "Enter") {
        event.preventDefault();

        selectItem(selectedIndex);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex]);

  return (
    <div
      id="commands-list"
      className="bg-popover border border-muted rounded-md shadow flex flex-col gap-1 overflow-auto p-2"
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={`flex items-center w-full text-left gap-1 px-2 py-1 rounded ${
              selectedIndex === index ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="px-2 py-1 text-gray-500">No result</div>
      )}
    </div>
  );
};

const updatePosition = ({
  editor,
  element,
}: {
  editor: Editor;
  element: HTMLElement;
}) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  };

  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

const renderItems: SuggestionOptions["render"] = () => {
  let component: ReactRenderer | null = null;

  return {
    onStart: ({
      editor,
      clientRect,
      ...rest
    }: {
      editor: Editor;
      clientRect: DOMRect;
    }) => {
      console.log("onStart", rest);
      component = new ReactRenderer(CommandsList, {
        editor,
        props: {
          editor,
          ...rest,
        },
      });

      if (!clientRect) {
        return;
      }

      component.element.style.position = "absolute";
      document.body.appendChild(component.element);

      updatePosition({ editor, element: component.element });
    },

    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      updatePosition({ editor: props.editor, element: component.element });
    },

    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        component?.destroy();
        component?.element.remove();

        return true;
      }

      return component?.ref?.onKeyDown(props);
    },

    onExit: () => {
      component?.destroy();
      component?.element.remove();
    },
  };
};

export const SlashCommand = Command.configure({
  suggestion: {
    items: ({ query }: { query: string }): SuggestionItem[] => [
      {
        title: "H1",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
    ],
    render: renderItems,
  },
});

export const handleSlashCommandKeyDown = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
    const slashCommandContainer = document.getElementById("commands-list");
    if (slashCommandContainer != null) return true;
  }
};
