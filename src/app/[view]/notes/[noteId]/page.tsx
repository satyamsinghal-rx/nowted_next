"use client";

import NotesPage from '@/app/folders/[folderId]/notes/[noteId]/page'
import React from 'react'
import { useParams } from 'next/navigation';

function ViewNotes() {
    const { view, noteId } = useParams();
    if (!noteId || !view) {
        throw new Error("Missing required parameters: noteId or view");
    }
    return (
        <NotesPage params={Promise.resolve({ noteId: String(noteId), view: String(view) })} />
    )
}

export default ViewNotes