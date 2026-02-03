import { Note } from '../features/notes/NoteTypes.ts';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDataFromStorage, storeData } from '../utils/asyncStorage.ts';
import uuid from 'react-native-uuid';

const NOTES_STORAGE_KEY = 'notes';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  deleteNote: (id: string) => void;
  updateNote: (
    id: string,
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  pinNote: (id: string) => void;
  unpinNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  isLoading: false,
  addNote: () => '',
  deleteNote: () => {},
  updateNote: () => {},
  pinNote: () => {},
  unpinNote: () => {},
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
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    console.log('Notes changed', notes);
  }, [notes]);

  const addNote = (
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>,
  ) => {
    const id = uuid.v4();
    const now = Date.now();
    const newNote: Note = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    return id;
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const updateNote = (
    id: string,
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const now = Date.now();
    const updatedNotes = notes.map(n =>
      n.id === id ? { ...n, ...note, updatedAt: now } : n,
    );
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const pinNote = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isPinned: true } : note,
    );
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const unpinNote = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isPinned: false } : note,
    );
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
        pinNote,
        unpinNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
