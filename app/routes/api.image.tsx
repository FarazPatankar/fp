import { LoaderFunctionArgs } from "@remix-run/node";
import satori, { SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getIconCode, loadEmoji } from "~/lib/twemoji";

declare module "react" {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

async function getFont(
  font: string,
  weights = [400, 500, 600, 700],
  text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`'’\"–—",
) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
      ";",
    )}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    },
  ).then(response => response.text());
  const resource = css.matchAll(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/g,
  );
  return Promise.all(
    [...resource]
      .map(match => match[1])
      .map(url => fetch(url).then(response => response.arrayBuffer()))
      .map(async (buffer, i) => ({
        name: font,
        style: "normal",
        weight: weights[i],
        data: await buffer,
      })),
  ) as Promise<SatoriOptions["fonts"]>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const emoji = url.searchParams.get("emoji");
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description");
  const category = url.searchParams.get("category");

  const jsx = (
    <div
      tw="flex flex-col px-12 py-16 h-full w-full"
      style={{
        backgroundImage: "linear-gradient(45deg, #ee9ca7 0%, #ffdde1 100%)",
        backgroundSize: "1200px 600px",
      }}
    >
      <div tw="flex flex-col h-[480px]">
        <span tw="text-8xl">{emoji}</span>
        <span tw="mt-16 font-bold text-4xl text-gray-900">{title}</span>
        <span tw="mt-4 text-xl max-w-lg text-gray-900 opacity-75">
          {description}
        </span>
      </div>
      <div tw="flex text-xs uppercase text-white font-semibold">
        <span>{category}</span>
        <span tw="mx-2 opacity-25">|</span>
        <span>farazpatankar.com</span>
      </div>
    </div>
  );
  // From satori docs example
  const svg = await satori(jsx, {
    width: 1200,
    height: 600,
    fonts: await getFont("Inter"),
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        return `data:image/svg+xml;base64,${btoa(
          await loadEmoji("twemoji", getIconCode(segment)),
        )}`;
      }

      // if segment is normal text
      return code;
    },
  });
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const data = pngData.asPng();
  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
