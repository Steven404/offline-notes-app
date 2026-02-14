import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Colors from '../../../styles/colors.ts';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import AddItemButton from '../../../components/addItemButton/AddItemButton.tsx';
import TaskModal from '../components/TaskModal.tsx';
import { useTasks } from '../../../providers/TasksContext.tsx';
import TaskCard from '../components/TaskCard.tsx';
import { Task } from '../TaskTypes.tsx';

const Tasks = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const { tasks } = useTasks();

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTaskToEdit(undefined);
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

      <AddItemButton onPress={() => setIsModalVisible(true)} />
      <TaskModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
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
