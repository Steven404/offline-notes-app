import notifee, {
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import uuid from 'react-native-uuid';

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const createReminderNotification = async (
  title: string,
  body: string,
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
      title: title,
      body: body,
      // android: {
      //   channelId: 'your-channel-id', // Ensure you've created this channel
      // },
    },
    trigger,
  );

  return notificationId;
};

//TODO: Add an update notification function OR when updating a notification time, remove the existing one and create a new one

export const removeReminderNotification = async (
  notificationId: string,
): Promise<void> => {
  await notifee.cancelNotification(notificationId);
};
