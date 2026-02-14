import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../../styles/colors.ts';
import BottomBarHeader from '../../../components/bottomBarHeader/BottomBarHeader.tsx';
import AddItemButton from '../../../components/addItemButton/AddItemButton.tsx';
import AddTaskModal from '../components/AddTaskModal.tsx';

const Tasks = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.pageWrapper}>
      <BottomBarHeader title={'Tasks'} />
      <AddItemButton onPress={() => setIsModalVisible(true)} />
      <AddTaskModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
});

export default Tasks;
