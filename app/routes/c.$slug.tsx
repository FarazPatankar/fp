import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getEntries } from "~/lib/pocketbase/entries";

import { EntryList } from "~/components/EntryList";
import { H1 } from "~/components/ui/typography";
import { getCategoryBySlug } from "~/lib/pocketbase/categories";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "No slug provided");

  const category = await getCategoryBySlug(slug);
  const entries = await getEntries(category.id);

  return json({ category, entries });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) {
    return [];
  }

  return [{ title: data.category.title }];
};

const CategoryPage = () => {
  const { category, entries } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <H1>{category.title}</H1>
      <EntryList entries={entries} />
    </div>
  );
};

export default CategoryPage;
