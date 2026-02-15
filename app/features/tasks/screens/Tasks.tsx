import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Colors from '../../../styles/colors.ts';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import AddItemButton from '../../../components/addItemButton/AddItemButton.tsx';
import TaskModal from '../components/TaskModal.tsx';
import { useTasks } from '../../../providers/TasksContext.tsx';
import TaskCard from '../components/TaskCard.tsx';
import { Task } from '../TaskTypes.tsx';
import ReminderBottomSheet from '../../notes/components/ReminderBottomSheet.tsx';
import { Reminder } from '../../../utils/types.ts';

const Tasks = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [reminder, setReminder] = useState<Reminder | undefined>(undefined);
  const [isReminderSheetOpen, setIsReminderSheetOpen] = useState(false);
  const { tasks } = useTasks();

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setReminder(task.reminder);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTaskToEdit(undefined);
    setReminder(undefined);
  };

  const handleOpenReminder = (currentReminder?: Reminder) => {
    setIsModalVisible(false);
    setReminder(currentReminder);
    setTimeout(() => {
      setIsReminderSheetOpen(true);
    }, 500);
  };

  const handleSaveReminder = (reminderData: { id: string; time: number }) => {
    setReminder({
      ...reminderData,
      noteId: taskToEdit?.id || '',
    });
    setIsReminderSheetOpen(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 500);
  };

  const handleRemoveReminder = () => {
    setReminder(undefined);
    setIsReminderSheetOpen(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 500);
  };

  const handleCloseReminder = () => {
    setIsReminderSheetOpen(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 500);
  };

  return (
    <View style={styles.pageWrapper}>
      <BottomBarHeader title={'Tasks'} showFilters={false} />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onEdit={() => handleEditTask(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AddItemButton
        onPress={() => {
          setTaskToEdit(undefined);
          setReminder(undefined);
          setIsModalVisible(true);
        }}
      />
      <TaskModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
        onOpenReminder={handleOpenReminder}
        reminder={reminder}
      />
      <ReminderBottomSheet
        title={taskToEdit?.title || 'Task Reminder'}
        content="Don't forget to complete your task!"
        reminder={reminder}
        isOpen={isReminderSheetOpen}
        onClose={handleCloseReminder}
        onSave={handleSaveReminder}
        onRemove={handleRemoveReminder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 14,
    zIndex: 1,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 80, // Space for AddItemButton
  },
});

export default Tasks;
