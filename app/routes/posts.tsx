import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getEntries } from "~/lib/pocketbase";
import { Link, useLoaderData } from "@remix-run/react";
import { H1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Posts" }];
};

export const loader = async () => {
  const entries = await getEntries("posts");

  return json({ entries });
};

const Posts = () => {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <H1>Posts</H1>
      <div className="flex flex-col items-start">
        {entries.map(entry => (
          <Button key={entry.id} variant="link" className="p-0" asChild>
            <Link to={`/p/${entry.slug}`}>{entry.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Posts;
