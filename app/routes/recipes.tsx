import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getEntries } from "~/lib/pocketbase";

import { H1 } from "~/components/ui/typography";
import { EntryList } from "~/components/EntryList";

export const meta: MetaFunction = () => {
  return [{ title: "Recipes" }];
};

export const loader = async () => {
  const entries = await getEntries("recipes");

  return json({ entries });
};

const Posts = () => {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <H1>Recipes</H1>
      <EntryList entries={entries} />
    </div>
  );
};

export default Posts;
