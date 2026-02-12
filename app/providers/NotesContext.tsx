import { Note } from '../features/notes/utils/NoteTypes.ts';
import { createContext, useContext, useEffect, useState } from 'react';
import { getDataFromStorage, storeData } from '../utils/asyncStorage.ts';
import uuid from 'react-native-uuid';
import { Reminder } from '../utils/types.ts';

const NOTES_STORAGE_KEY = 'notes';

// Date sorting options are based on updatedAt
export type SortOption =
  | 'title_ascending'
  | 'title_descending'
  | 'createdAt'
  | 'updatedAt';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  showPinnedOnly: boolean;
  setShowPinnedOnly: (showPinnedOnly: boolean) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  addNote: (
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>,
  ) => string;
  deleteNote: (id: string) => void;
  updateNote: (
    id: string,
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
  pinNote: (id: string) => void;
  unpinNote: (id: string) => void;
  setReminder: (noteId: string, reminder: Reminder) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  isLoading: false,
  sortBy: 'updatedAt',
  showPinnedOnly: false,
  setShowPinnedOnly: () => {},
  setSortBy: () => {},
  addNote: () => '',
  deleteNote: () => {},
  updateNote: () => {},
  pinNote: () => {},
  unpinNote: () => {},
  setReminder: () => {},
});

export const useNotes = () => useContext(NotesContext);

export const NotesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

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

  const setReminder = (noteId: string, reminder: Reminder) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, reminder } : note,
    );
    setNotes(updatedNotes);
    storeData(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        sortBy,
        setSortBy,
        addNote,
        deleteNote,
        updateNote,
        pinNote,
        unpinNote,
        setReminder,
        setShowPinnedOnly,
        showPinnedOnly,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
