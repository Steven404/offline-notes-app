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
import { Note } from '../utils/NoteTypes.ts';
import {
  createReminderNotification,
  removeReminderNotification,
} from '../../../utils/reminders.ts';
import { useNotes } from '../../../providers/NotesContext.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import colors from '../../../styles/colors.ts';

interface ReminderBottomSheetProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

const ReminderBottomSheet = ({
  note,
  isOpen,
  onClose,
}: ReminderBottomSheetProps) => {
  const { setReminder, removeReminder } = useNotes();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Store original reminder time to detect changes
  const originalReminderTime = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Prefill date and time if note has a reminder and it's in the future
      if (note.reminder && note.reminder.time > Date.now()) {
        const reminderDate = new Date(note.reminder.time);
        setSelectedDate(reminderDate);
        setSelectedTime(reminderDate);
        originalReminderTime.current = note.reminder.time;
      } else {
        originalReminderTime.current = null;
      }
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen, note.reminder]);

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
      note,
      combined.getTime(),
    );

    if (notificationId) {
      setReminder(note.id, {
        id: notificationId,
        noteId: note.id,
        time: combined.getTime(),
      });
    }

    resetAndClose();
  };

  const handleRemove = async () => {
    if (note.reminder?.id) {
      await removeReminderNotification(note.reminder.id);
      removeReminder(note.id);
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
          {note.reminder && note.reminder.time > Date.now() ? (
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
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.placeholder,
  },
  inputTouchable: {
    backgroundColor: Colors.placeholder + '20',
    borderWidth: 1,
    borderColor: Colors.placeholder + '40',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
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
    marginTop: 'auto',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.deleteRed + '20',
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.deleteRed,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  textButton: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.placeholder,
  },
  saveTextButton: {
    color: Colors.secondary,
  },
  saveTextButtonDisabled: {
    opacity: 0.4,
  },
});

export default ReminderBottomSheet;
