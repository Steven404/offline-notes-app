import { Note } from './NoteTypes.ts';
import { SortOption } from '../../../providers/NotesContext.tsx';

export const sortNotes = (
  notes: Note[],
  sortBy: SortOption,
  showPinnedOnly: boolean,
): Note[] => {
  return [...notes]
    .filter(note => !showPinnedOnly || note.isPinned)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title_ascending':
          return a.title.localeCompare(b.title);
        case 'title_descending':
          return b.title.localeCompare(a.title);
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'updatedAt':
          return b.updatedAt - a.updatedAt;
        default:
          return 0;
      }
    });
};
