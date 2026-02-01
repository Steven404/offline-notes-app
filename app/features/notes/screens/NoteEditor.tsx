import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../../../styles/colors.ts';
import Icon from '../../../components/icon/Icon.tsx';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoteTitleInput from '../components/NoteTitleInput.tsx';
import NoteContentInput from '../components/NoteContentInput.tsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const NoteEditor = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Icon name="floppy-disk" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <NoteTitleInput title={title} setTitle={setTitle} />
        <NoteContentInput />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 14,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flexGrow: 1,
  },
});

export default NoteEditor;
