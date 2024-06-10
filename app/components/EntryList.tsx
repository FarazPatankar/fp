import { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { EntriesResponse } from "~/lib/pocketbase/db-types";

import { Button } from "./ui/button";

export const EntryList = ({
  entries,
}: {
  entries: SerializeFrom<EntriesResponse>[];
}) => {
  return (
    <div className="flex flex-col items-start">
      {entries.map(entry => (
        <Button key={entry.id} variant="link" className="p-0" asChild>
          <Link to={`/p/${entry.slug}`}>{entry.title}</Link>
        </Button>
      ))}
    </div>
  );
};
