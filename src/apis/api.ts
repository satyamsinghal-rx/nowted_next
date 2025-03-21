import { Folder, Note, NotesParams } from "@/types/type";
import axios from "axios";

const API_URL = "https://nowted-server.remotestate.com";

export const getNotes = async (params: Partial<NotesParams> = {}): Promise<Note[]> => {
    try{
        const response = await axios.get<{notes: Note[]}>(`${API_URL}/notes`, {params});
        console.log("API Response:", response.data);
    return response.data.notes;
    } catch (error) {
        console.log("Error getting folders:", error);
        return [];
    }
}

export const getFolders = async (): Promise<Folder[]> => {
    try{
        const response = await axios.get<{folders: Folder[]}>(`${API_URL}/folders`);
    return response.data.folders;
    } catch (error) {
        console.log("Error getting folders:", error);
        return [];
    }
}

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
  }

