import NotesPage from '@/app/folders/[folderId]/notes/[noteId]/page'
import React from 'react'

function ViewNotes({
    params,
  }: {
    params: Promise<{ view: string; noteId: string }>;
  }) {
    
  return (
    <NotesPage params={params} />)
}

export default ViewNotes