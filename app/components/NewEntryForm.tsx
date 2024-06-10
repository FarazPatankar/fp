import { Form } from "@remix-run/react";

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

export const NewEntryForm = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          New
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Post</SheetTitle>
          <SheetDescription>Create a new post</SheetDescription>
        </SheetHeader>

        <Form
          method="POST"
          action="/p/new"
          className="my-6 grid gap-4"
          reloadDocument
        >
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" required />
          </div>

          <Button type="submit" className="max-w-max" name="intent" value="new">
            Create
          </Button>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
