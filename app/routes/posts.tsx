import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getEntries } from "~/lib/pocketbase";

import { H1 } from "~/components/ui/typography";
import { EntryList } from "~/components/EntryList";

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
      <EntryList entries={entries} />
    </div>
  );
};

export default Posts;
