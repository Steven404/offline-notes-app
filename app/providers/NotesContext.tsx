import { Note } from '../features/notes/NoteTypes.ts';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDataFromStorage, storeData } from '../utils/asyncStorage.ts';

const NOTES_STORAGE_KEY = 'notes';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, note: Note) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  isLoading: false,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await getDataFromStorage(NOTES_STORAGE_KEY);
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (e) {
        console.error('Failed to load notes', e);
      } finally {
        setIsLoading(false);
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
        isLoading,
        addNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
