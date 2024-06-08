import { Flex } from "@radix-ui/themes";
import type { MetaFunction } from "@remix-run/node";
import Tiptap from "~/components/TipTap";

export const meta: MetaFunction = () => {
  return [
    { title: "Scratchpad" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
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
      <Tiptap />
    </Flex>
  );
}
