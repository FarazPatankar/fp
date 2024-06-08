import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getEntries } from "~/lib/pocketbase";
import { Link, useLoaderData } from "@remix-run/react";
import { H2 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

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
      <H2>Posts</H2>
      <div>
        {entries.map(entry => (
          <Button variant="link" className="p-0" asChild>
            <Link key={entry.id} to={`/posts/${entry.slug}`}>
              {entry.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Home;
