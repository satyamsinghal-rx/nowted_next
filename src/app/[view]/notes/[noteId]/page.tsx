"use client";

import NotesPage from '@/app/folders/[folderId]/notes/[noteId]/page'
import React, { use } from 'react'

function ViewNotes({
    params,
}: {
    params: Promise<{ view: string; noteId: string }>;
}) {
    const { view, noteId } = use(params); 
    return (
        <NotesPage params={{ noteId, view }} />
    )
}

export default ViewNotes