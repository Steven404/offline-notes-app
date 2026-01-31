import { Note } from '../features/notes/NoteTypes.ts';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDataFromStorage, storeData } from '../utils/asyncStorage.ts';

const NOTES_STORAGE_KEY = 'notes';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, note: Note) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
});

export const useNotes = () => useContext(NotesContext);

export const NotesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await getDataFromStorage(NOTES_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    };
    loadNotes();
  }, []);

  const addNote = (note: Note) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const updateNote = (id: string, note: Note) => {
    const updatedNotes = notes.map(n => (n.id === id ? note : n));
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
