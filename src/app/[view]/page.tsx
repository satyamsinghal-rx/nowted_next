"use client";

import React, { use } from "react";
import { getNotes } from "@/apis/api";
import NotesList from "@/components/NotesList/NotesList";
import { useQuery } from "@tanstack/react-query";
import NoNote from "@/components/NoteEditor/NoNote";

function View({ params }: { params: Promise<{ view: string }> }) {
  const { view } = use(params);

  const initialParams = {
    page: 1,
    limit: 10,
    ...(view === "favorites" && { favorite: true }),
    ...(view === "archived" && { archived: true }),
    ...(view === "trash" && { deleted: true }),
  };

  const { data: notes } = useQuery({
    queryKey: ["notes", initialParams],
    queryFn: () => getNotes(initialParams),
  });

  let title: string = "All Notes";

if(view === "favorites") title = "Favorites"
else if(view === "archived") title = "Archived"
else if(view === "trash") title = "Trash"

  return (
    <>
      <NotesList
        notes={notes || []}
        title={title}
        initialParams={initialParams}
      />
      <NoNote/>
    </>
    
  );
}

export default View;
