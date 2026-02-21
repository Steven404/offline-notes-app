import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import AddItemButton from '../../../components/addItemButton/AddItemButton.tsx';
import TaskModal from '../components/TaskModal.tsx';
import { useTasks } from '../../../providers/TasksContext.tsx';
import TaskCard from '../components/TaskCard.tsx';
import { Task } from '../TaskTypes.tsx';
import ReminderBottomSheet from '../../notes/components/ReminderBottomSheet.tsx';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';
import { Reminder } from '../../../utils/types.ts';
import Consts from '../../../utils/consts.ts';
import Animated from 'react-native-reanimated';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';
import NoTasks from '../components/NoTasks.tsx';

const Tasks = () => {
  const { tasks, deleteTask } = useTasks();

  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [reminder, setReminder] = useState<Reminder | undefined>(undefined);
  const [isReminderSheetOpen, setIsReminderSheetOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds for notification bell in to go away if needed

    return () => clearInterval(interval);
  }, []);

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

  const handleDeletePress = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setIsDeleteModalVisible(true);
    }, 500);
  };

  const confirmTaskDeletion = () => {
    if (taskToEdit) {
      deleteTask(taskToEdit.id);
      setIsDeleteModalVisible(false);
      setTaskToEdit(undefined);
      setReminder(undefined);
    }
  };

  const cancelTaskDeletion = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 500);
  };

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard task={item} onEdit={() => handleEditTask(item)} />
    ),
    [],
  );

  const pageContent =
    tasks.length > 0 ? (
      <Animated.FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    ) : (
      <NoTasks />
    );

  return (
    <View style={styles.pageWrapper}>
      <BottomBarHeader title={'Tasks'} showFilters={false} />

      {pageContent}

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
        onDelete={handleDeletePress}
      />
      <SimpleConfirmModal
        isVisible={isDeleteModalVisible}
        onClose={cancelTaskDeletion}
        onConfirm={confirmTaskDeletion}
        title={'Delete task'}
        text={'Are you sure you want to delete this task?'}
        confirmText={'Delete'}
        cancelText={'Cancel'}
      />
      <ReminderBottomSheet
        title={taskToEdit?.title || 'Task Reminder'}
        content={Consts.taskNotificationBody}
        reminder={reminder}
        isOpen={isReminderSheetOpen}
        onClose={handleCloseReminder}
        onSave={handleSaveReminder}
        onRemove={handleRemoveReminder}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    pageWrapper: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 14,
      zIndex: 1,
    },
    listContent: {
      paddingTop: 14,
      paddingBottom: 80, // Space for AddItemButton
    },
  });

export default Tasks;
