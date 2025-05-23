"use client";

import { getFolders, getNotes } from "@/apis/api";
import NoNote from "@/components/NoteEditor/NoNote";
import NotesList from "@/components/NotesList/NotesList";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter();

  const { data: folders = [], isSuccess } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  const folderId = useMemo(
    () => (folders.length > 0 ? folders[0].id : null),
    [folders]
  );

  const { data: notesByFolder = [] } = useQuery({
    queryKey: ["notes", folderId],
    queryFn: () => {
      return getNotes({ folderId: folderId ?? undefined });
    },
    enabled: !!folderId,
  });

  useEffect(() => {
    if (isSuccess && folders.length > 0) {
      router.push(`/folders/${folders[0].id}`);
      
    }
  }, [isSuccess, folders, router]);

  const getTitle = () => {
    if (folderId) {
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    } else {
      return "All Notes";
    }
  };
  const title: string = getTitle();

  const params = { folderId: folderId ?? undefined, page: 1, limit: 10 };

  return (
    <>
      <NotesList notes={notesByFolder} title={title} initialParams={params} />
      <NoNote />
    </>
  );
}
