import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Flex, Heading, Link, Text } from "@radix-ui/themes";

import { getEntries } from "~/lib/pocketbase";
import { useLoaderData } from "@remix-run/react";

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
    <Flex
      direction="column"
      gap="4"
      maxWidth="1024px"
      width="100%"
      mx="auto"
      my="8"
      align="start"
    >
      <Heading>Posts</Heading>
      <Flex direction="column" gap="4">
        {entries.map(entry => (
          <Link key={entry.id} href={`/posts/${entry.slug}`}>
            {entry.title}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default Home;
