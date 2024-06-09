import { Form } from "@remix-run/react";

import { EntriesResponse } from "~/lib/pocketbase/db-types";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const EntryInfoForm = ({ entry }: { entry: EntriesResponse }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          Info
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Post details</SheetTitle>
          <SheetDescription>
            Configure metadata and attributes for this post.
          </SheetDescription>
        </SheetHeader>

        <Form method="POST" className="my-6 grid gap-4" reloadDocument>
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={entry.title} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={entry.meta?.description ?? ""}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              defaultValue={entry.category}
            />
          </div>

          <Input
            id="id"
            name="id"
            value={entry.id}
            className="hidden"
            readOnly
          />

          <Button
            type="submit"
            className="max-w-max"
            name="intent"
            value="info"
          >
            Update
          </Button>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
