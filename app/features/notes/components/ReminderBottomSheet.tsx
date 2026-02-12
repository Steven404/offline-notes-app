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
import { createReminderNotification } from '../../../utils/reminders.ts';
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
  const { setReminder } = useNotes();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const isSaveDisabled = useMemo(() => {
    if (!selectedDate || !selectedTime) {
      return true;
    }

    const combined = new Date(selectedDate);
    combined.setHours(selectedTime.getHours());
    combined.setMinutes(selectedTime.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);

    return combined.getTime() <= Date.now();
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

  const resetAndClose = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
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
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={resetAndClose}
          >
            <TextLabel text="Cancel" style={styles.buttonText} />
          </Pressable>
          <Pressable
            style={[
              styles.button,
              styles.saveButton,
              isSaveDisabled && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSaveDisabled}
          >
            <TextLabel text="Save" style={styles.buttonText} />
          </Pressable>
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
    paddingBottom: 28,
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
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.placeholder + '30',
  },
  saveButton: {
    backgroundColor: Colors.secondary,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
  },
});

export default ReminderBottomSheet;
