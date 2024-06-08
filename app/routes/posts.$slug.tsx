import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";

import Tiptap from "~/components/TipTap";
import { authenticator } from "~/lib/auth/auth.server";
import { getEntry, updateEntry } from "~/lib/pocketbase";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const id = body.get("id") as string;
  const content = body.get("content") as string;

  await updateEntry({ id, content });

  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (params.slug === undefined) throw new Error("No slug provided");

  const entry = await getEntry(params.slug);
  const isAuthenticated = await authenticator.isAuthenticated(request);

  return json({ entry, isAuthenticated: isAuthenticated != null });
};

const Post = () => {
  const { entry, isAuthenticated } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const onSave = (html: string) => {
    submit(
      {
        id: entry.id,
        content: html,
      },
      { method: "post" },
    );
  };

  return (
    <div>
      <Tiptap
        content={entry.content}
        onSave={onSave}
        editable={isAuthenticated}
      />
    </div>
  );
};

export default Post;
