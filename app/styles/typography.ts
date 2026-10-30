import { TextStyle } from 'react-native';
import Fonts from './Fonts.tsx';

/**
 * Type roles. Pick by purpose, not by size.
 *
 * Literata (serif) is the user's voice: screen and note titles, note text,
 * task titles. Montserrat (sans) is the app's voice: controls, labels, dates.
 * Line heights run generous because most surfaces are dark, and light text
 * on dark needs more air to read evenly.
 */
export type TypeRole =
  | 'largeTitle'
  | 'title'
  | 'heading'
  | 'itemTitle'
  | 'body'
  | 'preview'
  | 'label'
  | 'button'
  | 'meta'
  | 'sectionLabel'
  | 'tab';

type RoleStyle = TextStyle & {
  /** Caps Dynamic Type growth for roles that would otherwise break layout */
  maxFontSizeMultiplier?: number;
};

export const Type: Record<TypeRole, RoleStyle> = {
  // Tab roots: Notes, Tasks
  largeTitle: {
    fontFamily: Fonts.LiterataDisplaySemiBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.4,
    maxFontSizeMultiplier: 1.3,
  },
  // A note's own title, read and edited at the same size
  title: {
    fontFamily: Fonts.LiterataDisplaySemiBold,
    fontSize: 28,
    lineHeight: 35,
    letterSpacing: -0.2,
    maxFontSizeMultiplier: 1.4,
  },
  // Pushed-screen titles, dialog and sheet titles
  heading: {
    fontFamily: Fonts.LiterataSemiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  // Note card and task titles
  itemTitle: {
    fontFamily: Fonts.LiterataSemiBold,
    fontSize: 17,
    lineHeight: 23,
  },
  // Note text and subtasks: the reading role
  body: {
    fontFamily: Fonts.LiterataRegular,
    fontSize: 17,
    lineHeight: 27,
  },
  // One-line note excerpt on cards
  preview: {
    fontFamily: Fonts.LiterataRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  // Settings rows, inputs, dialog messages
  label: {
    fontFamily: Fonts.MontserratMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 16,
    lineHeight: 20,
    maxFontSizeMultiplier: 1.5,
  },
  // Dates, counts, reminder times
  meta: {
    fontFamily: Fonts.MontserratMedium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  // Grouped-list headers (Settings: General, About)
  sectionLabel: {
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tab: {
    fontFamily: Fonts.MontserratMedium,
    fontSize: 11,
    lineHeight: 14,
    maxFontSizeMultiplier: 1.2,
  },
};

/** Style without the non-style multiplier, for places that take raw styles */
export const typeStyle = (role: TypeRole): TextStyle => {
  const style: RoleStyle = { ...Type[role] };
  delete style.maxFontSizeMultiplier;
  return style;
};
