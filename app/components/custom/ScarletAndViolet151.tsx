import TCGdex, { Set } from "@tcgdex/sdk";
import { useEffect, useMemo, useState } from "react";
import { generateJSON } from "@tiptap/html";
import { extensions } from "../editor/advanced-editor";
import { cn } from "~/lib/utils";

const tcgdex = new TCGdex("en");

export const ScarletAndViolet151 = ({ content }: { content: string }) => {
  const [cards, setCards] = useState<Set["cards"]>([]);

  const fetchSet = async () => {
    const data = await tcgdex.fetch("sets", "151");
    if (data == null) {
      return;
    }

    setCards(data.cards);
  };

  useEffect(() => {
    fetchSet();
  }, []);

  const list = useMemo(() => {
    const response = generateJSON(content, extensions);

    const data = response.content[0].content as {
      attrs: { checked: boolean };
      content: [
        {
          content: [{ text: string }];
        },
      ];
    }[];

    return data.map(item => {
      const text = item.content[0].content[0].text;

      const numMatch = text.match(/\((\d+)\)/);

      return {
        checked: item.attrs.checked,
        total: numMatch ? parseInt(numMatch[1], 10) : 0,
      };
    });
  }, [content]);

  console.log(cards, list);

  return (
    <article className="flex flex-col space-y-10">
      <div className="flex flex-col">
        <ul>
          <li>
            - Cards with full opacity are the ones I have already collected.
          </li>
          <li>
            <p>- If I have more than 1 copy of a card:</p>
            <p className="ml-4">
              - the bottom right of the card shows how many I have.
            </p>
            <p className="ml-4">- the card is available for a trade or sale.</p>
          </li>
        </ul>
      </div>
      <div className="grid gap-x-6 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto">
        {cards.map((c, idx) => (
          <div
            className={cn(
              "transition hover:scale-105",
              "relative",
              "opacity-40",
              list[idx].checked && "opacity-100",
            )}
          >
            <img src={c.image + "/low.webp"} alt={c.name} />
            {list[idx].checked && list[idx].total > 0 && (
              <div className="absolute bottom-0 right-0 mb-1 mr-1 bg-pink-400 rounded-full h-8 w-8 flex items-center justify-center">
                <span className="font-medium text-sm">{list[idx].total}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
};
