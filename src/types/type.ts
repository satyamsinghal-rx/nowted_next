export interface Note {
    id: string;
    title: string;
    content: string;
    preview: string;
    folderId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isFavorite: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    note: Note;
  }

  export interface NotesParams {
    archived: boolean;
    favorite: boolean;
    deleted: boolean;
    folderId: string;
    page: number;
    limit: number;
    search: string;
  };
  
  export interface Folder {
    title: string;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }