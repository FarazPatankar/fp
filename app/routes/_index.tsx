import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getEntries } from "~/lib/pocketbase";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Scratchpad" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const entries = await getEntries();

  return json({ entries });
};

const Home = () => {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2>Posts</h2>
      <div>
        {entries.map(entry => (
          <Link key={entry.id} to={`/posts/${entry.slug}`}>
            {entry.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
