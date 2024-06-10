import { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { EntriesResponse } from "~/lib/pocketbase/db-types";

import { Button } from "./ui/button";
import { Muted } from "./ui/typography";
import { dateStringToDate } from "~/lib/utils";

export const EntryList = ({
  entries,
}: {
  entries: SerializeFrom<EntriesResponse>[];
}) => {
  return (
    <div className="flex flex-col items-start">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="w-full flex items-center justify-between"
        >
          <Button variant="link" className="p-0 text-base" asChild>
            <Link to={`/p/${entry.slug}`}>{entry.title}</Link>
          </Button>
          <Muted>{dateStringToDate(entry.created)}</Muted>
        </div>
      ))}
    </div>
  );
};
