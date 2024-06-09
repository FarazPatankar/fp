import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";

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
  const navigate = useNavigate();

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        if (!isAuthenticated) {
          toast.info("Edit mode is disabled", {
            description:
              "Please login to enable edit mode. Cmd + Shift + L to login.",
          });
          return;
        }

        if (isEditing) {
          setIsEditing(false);
          toast.dismiss();
          return;
        }

        setIsEditing(true);
        toast.info("Edit mode enabled", {
          duration: Infinity,
          description: "Cmd + E to exit. Cmd + S to save.",
        });
      }

      if (e.key === "l" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        navigate(`/login?redirect=/posts/${entry.slug}`);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [isEditing]);

  return (
    <div className="grid gap-4 relative">
      <div className="flex justify-between items-center">
        <H2>{entry.title}</H2>
      </div>

      {isEditing ? (
        <Suspense>
          <Tiptap
            content={entry.content}
            onSave={onSave}
            editable={isEditing}
            setIsEditing={setIsEditing}
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
