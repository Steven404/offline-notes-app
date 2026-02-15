import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import {
  createReminderNotification,
  removeReminderNotification,
} from '../../../utils/reminders.ts';
import Icon from '../../../components/icon/Icon.tsx';
import colors from '../../../styles/colors.ts';
import { Reminder } from '../../../utils/types.ts';

interface ReminderBottomSheetProps {
  title: string;
  content: string;
  reminder?: Reminder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: { id: string; time: number }) => void;
  onRemove: () => void;
}

const ReminderBottomSheet = ({
  title,
  content,
  reminder,
  isOpen,
  onClose,
  onSave,
  onRemove,
}: ReminderBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Store original reminder time to detect changes
  const originalReminderTime = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Prefill date and time if reminder exists and it's in the future
      if (reminder && reminder.time > Date.now()) {
        const reminderDate = new Date(reminder.time);
        setSelectedDate(reminderDate);
        setSelectedTime(reminderDate);
        originalReminderTime.current = reminder.time;
      } else {
        originalReminderTime.current = null;
      }
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen, reminder]);

  const isSaveDisabled = useMemo(() => {
    if (!selectedDate || !selectedTime) {
      return true;
    }

    const combined = new Date(selectedDate);
    combined.setHours(selectedTime.getHours());
    combined.setMinutes(selectedTime.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);

    const combinedTime = combined.getTime();

    // Check if time is in the past
    if (combinedTime <= Date.now()) {
      return true;
    }

    // If editing an existing reminder, disable save unless time has changed
    if (originalReminderTime.current !== null) {
      return combinedTime === originalReminderTime.current;
    }

    return false;
  }, [selectedDate, selectedTime]);

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const combined = new Date(selectedDate);
    combined.setHours(selectedTime.getHours());
    combined.setMinutes(selectedTime.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);

    const notificationId = await createReminderNotification(
      title,
      content.substring(0, 40),
      combined.getTime(),
    );

    if (notificationId) {
      onSave({
        id: notificationId,
        time: combined.getTime(),
      });
    }

    resetAndClose();
  };

  const handleRemove = async () => {
    if (reminder?.id) {
      await removeReminderNotification(reminder.id);
      onRemove();
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
    originalReminderTime.current = null;
    onClose();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: Date | null) => {
    if (!time) return 'Select Time';
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      onDismiss={resetAndClose}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.content}>
        <TextLabel text="Set Reminder" style={styles.title} />

        <View style={styles.inputsContainer}>
          <TouchableOpacity
            style={styles.inputTouchable}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name={'calendar-alt'} size={20} color={colors.placeholder} />
            <TextLabel
              text={formatDate(selectedDate)}
              style={[
                styles.inputText,
                !selectedDate && styles.placeholderText,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputTouchable}
            onPress={() => setShowTimePicker(true)}
          >
            <Icon name={'clock'} size={20} color={colors.placeholder} />
            <TextLabel
              text={formatTime(selectedTime)}
              style={[
                styles.inputText,
                !selectedTime && styles.placeholderText,
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          {reminder && reminder.time > Date.now() ? (
            <Pressable style={styles.removeButton} onPress={handleRemove}>
              <Icon name={'trash-alt'} size={20} color={colors.deleteRed} />
              <TextLabel text="Remove" style={styles.removeButtonText} />
            </Pressable>
          ) : (
            <View />
          )}
          <View style={styles.rightButtons}>
            <Pressable onPress={resetAndClose}>
              <TextLabel text="Cancel" style={styles.textButton} />
            </Pressable>
            <Pressable onPress={handleSave} disabled={isSaveDisabled}>
              <TextLabel
                text="Save"
                style={[
                  styles.textButton,
                  styles.saveTextButton,
                  isSaveDisabled && styles.saveTextButtonDisabled,
                ]}
              />
            </Pressable>
          </View>
        </View>

        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate || new Date()}
          onConfirm={date => {
            setSelectedDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
          mode="date"
          minimumDate={today}
          theme="dark"
        />

        <DatePicker
          modal
          open={showTimePicker}
          minimumDate={today}
          date={selectedTime || new Date()}
          onConfirm={time => {
            setSelectedTime(time);
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
          mode="time"
          theme="dark"
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.tabBarBackground,
  },
  handleIndicator: {
    backgroundColor: Colors.placeholder,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 42,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkerBackground,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  inputText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.textColor,
  },
  placeholderText: {
    color: Colors.placeholder,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  textButton: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.placeholder,
    padding: 8,
  },
  saveTextButton: {
    color: Colors.primary,
  },
  saveTextButtonDisabled: {
    color: Colors.placeholder,
    opacity: 0.5,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButtonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.deleteRed,
  },
});

export default ReminderBottomSheet;
