import { Folder, Note, NotesParams } from "@/types/type";
import axios from "axios";

const API_URL = "https://nowted-server.remotestate.com";

export const getNotes = async (
  params: Partial<NotesParams> = {}
): Promise<Note[]> => {
  try {
    const response = await axios.get<{ notes: Note[] }>(`${API_URL}/notes`, {
      params,
    });
    return response.data.notes;
  } catch (error) {
    console.log("Error getting folders:", error);
    return [];
  }
};

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const response = await axios.get<{ folders: Folder[] }>(
      `${API_URL}/folders`
    );
    return response.data.folders;
  } catch (error) {
    console.log("Error getting folders:", error);
    return [];
  }
};

export const getRecents = async (): Promise<Note[]> => {
  try {
    const response = await axios.get<{ recentNotes: Note[] }>(
      `${API_URL}/notes/recent`
    );
    return response.data.recentNotes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getNoteById = async (noteId: string): Promise<Note> => {
  try {
    const response = await axios.get<{ note: Note }>(
      `${API_URL}/notes/${noteId}`
    );
    return response.data.note;
  } catch (error) {
    console.log(error);
    return {} as Note;
  }
};

export const updateNote = async (
  noteId: string,
  note: Partial<Note>
): Promise<Note> => {
  try {
    const response = await axios.patch<{ note: Note }>(
      `${API_URL}/notes/${noteId}`,
      note
    );
    return response.data.note;
  } catch (error) {
    console.log(error);
    return {} as Note;
  }
};

export const updateFolder = async (
  id: string,
  name: string,
): Promise<Folder | null> => {
  try {
    const response = await axios.patch<{ folder: Folder }>(
      `${API_URL}/folders/${id}`,
      { name }
    );
    return response.data.folder;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const favoriteNote = async (
  noteId: string,
  isFavorite: boolean
): Promise<Note> => {
  try {
    const response = await axios.patch<{ note: Note }>(
      `${API_URL}/notes/${noteId}`,
      { isFavorite }
    );
    return response.data.note;
  } catch (error) {
    console.log(error);
    return {} as Note;
  }
};

export const archiveNote = async (
  noteId: string,
  isArchived: boolean
): Promise<Note> => {
  try {
    const response = await axios.patch<{ note: Note }>(
      `${API_URL}/notes/${noteId}`,
      { isArchived }
    );
    return response.data.note;
  } catch (error) {
    console.log(error);
    return {} as Note;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/notes/${noteId}`);
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to handle it in the component
  }
};

export const createNote = async (
  note: Partial<Note>
): Promise<Note | undefined> => {
  try {
    const response = await axios.post<{ note: Note }>(`${API_URL}/notes`, note);
    return response.data.note;
  } catch (error) {
    console.error("Error creating note:", error);
    return undefined;
  }
};

export const createFolder = async (
  folder: Partial<Folder>
): Promise<Folder | null> => {
  try {
    const response = await axios.post<{ folder: Folder }>(
      `${API_URL}/folders`,
      folder
    );
    return response.data.folder;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const restoreNoteById = async (id: string) => {
  try {
    await axios.post(`${API_URL}/notes/${id}/restore`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/folders/${id}`);
  } catch (error) {
    console.log(error);
  }
};
