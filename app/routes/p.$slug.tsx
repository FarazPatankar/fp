import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { SEOHandle } from "@nasa-gcn/remix-seo";
import { serverOnly$ } from "vite-env-only/macros";

import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("typescript", typescript);

import { H1 } from "~/components/ui/typography";
import { authenticator } from "~/lib/auth/auth.server";
import {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
} from "~/lib/pocketbase";
import { EntryInfoForm } from "~/components/EntryInfoForm";

const Editor = lazy(() => import("~/components/editor/advanced-editor"));

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => {
    const entries = await getEntries(null);

    return entries.map(entry => {
      return {
        route: `/p/${entry.slug}`,
        lastmod: entry.updated,
        priority: 0.8,
      };
    });
  }),
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const intent = body.get("intent");
  invariant(intent, "No intent provided");

  if (intent === "content") {
    const id = body.get("id");
    invariant(typeof id === "string", "No id provided");

    const content = body.get("content");
    invariant(typeof content === "string", "No content provided");

    await updateEntry({ id, args: { content } });
    return json({ success: true });
  }

  const title = body.get("title");
  invariant(typeof title === "string", "No title provided");

  const description = body.get("description");
  invariant(typeof description === "string", "No description provided");

  const category = body.get("category");
  invariant(typeof category === "string", "No category provided");

  if (intent === "new") {
    const entry = await createEntry({
      title,
      category,
      meta: { description },
    });

    return redirect(`/p/${entry.slug}`);
  }

  const id = body.get("id");
  invariant(typeof id === "string", "No id provided");

  await updateEntry({
    id,
    args: {
      title,
      category,
      meta: { description },
    },
  });

  return json({ success: true });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const slug = params.slug;
  invariant(slug, "No slug provided");

  const entry = await getEntry(slug);
  const isAuthenticated = await authenticator.isAuthenticated(request);

  return json({ entry, isAuthenticated: isAuthenticated != null });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data == null) {
    return [];
  }

  return [{ title: data.entry.title }];
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
        intent: "content",
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
    hljs.highlightAll();
  }, [isEditing]);

  const { state } = useNavigation();
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (state === "idle" && data?.success) {
      setIsEditing(false);
    }
  }, [state, data]);

  return (
    <div className="grid gap-8 relative">
      <div className="flex justify-between items-center">
        <H1>{entry.title}</H1>
        {isEditing && <EntryInfoForm entry={entry} />}
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
          className="prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      )}
    </div>
  );
};

export default Post;
