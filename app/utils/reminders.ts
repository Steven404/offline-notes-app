import notifee, {
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import uuid from 'react-native-uuid';
import { Note } from '../features/notes/utils/NoteTypes';

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const createReminderNotification = async (
  note: Note,
  timestamp: number,
): Promise<string | undefined> => {
  const notificationPermission = await notifee.requestPermission();
  if (
    notificationPermission.authorizationStatus !==
    AuthorizationStatus.AUTHORIZED
  ) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
  };

  const notificationId = uuid.v4() as string;

  await notifee.createTriggerNotification(
    {
      id: notificationId,
      title: note.title,
      body: stripHtmlTags(note.content).substring(0, 40),
      // android: {
      //   channelId: 'your-channel-id', // Ensure you've created this channel
      // },
    },
    trigger,
  );

  return notificationId;
};

export const removeReminderNotification = async (
  notificationId: string,
): Promise<void> => {
  await notifee.cancelNotification(notificationId);
};
