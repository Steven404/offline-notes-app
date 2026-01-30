import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';
import Icon from '../../../components/icon/Icon.tsx';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewNote = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.pageWrapper}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={Colors.white} />
        </Pressable>
        <TextLabel text={'New Note'} style={styles.headerText} />
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <TextLabel
          text={'Create your note here...'}
          style={styles.placeholderText}
        />
      </View>
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
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: Fonts.MontserratSemiBold,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratRegular,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default NewNote;
