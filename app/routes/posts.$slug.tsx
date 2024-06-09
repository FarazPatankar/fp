import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("typescript", typescript);

// import Editor from "~/components/editor/advanced-editor";

import { Button } from "~/components/ui/button";
import { H2 } from "~/components/ui/typography";
import { authenticator } from "~/lib/auth/auth.server";
import { getEntry, updateEntry } from "~/lib/pocketbase";

const Tiptap = lazy(() => import("~/components/TipTap"));
const Editor = lazy(() => import("~/components/editor/advanced-editor"));

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

  const [value, setValue] = useState(entry.content);
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

      if (e.key === "s" && (e.metaKey || e.ctrlKey) && isEditing) {
        e.preventDefault();

        onSave(value);

        toast.success("Content saved", {
          description: "Content has been saved successfully.",
        });
      }

      if (e.key === "l" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        navigate(`/login?redirect=/posts/${entry.slug}`);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    hljs.highlightAll();
  }, [isEditing]);

  return (
    <div className="grid gap-4 relative">
      <div className="flex justify-between items-center">
        <H2>{entry.title}</H2>
      </div>

      {isEditing ? (
        <Suspense>
          <Editor
            initialValue={value}
            onChange={val => {
              console.log(val);
              setValue(val);
            }}
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
