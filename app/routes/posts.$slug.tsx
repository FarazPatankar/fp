import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Suspense, lazy, useState } from "react";

import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { authenticator } from "~/lib/auth/auth.server";
import { getEntry, updateEntry } from "~/lib/pocketbase";

const Tiptap = lazy(() => import("~/components/TipTap"));

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
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <H2>{entry.title}</H2>
        <Button type="button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <Suspense>
          <Tiptap
            content={entry.content}
            onSave={onSave}
            editable={isEditing}
          />
        </Suspense>
      ) : (
        <article
          className="prose prose-slate dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      )}
    </div>
  );
};

export default Post;
