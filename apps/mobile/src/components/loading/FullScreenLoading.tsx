import React from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import { PathfindrLoader } from './PathfindrLoader';

interface FullScreenLoadingProps {
  visible: boolean;
  message?: string;
}

export const FullScreenLoading = ({ visible, message = 'Finding your path...' }: FullScreenLoadingProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <PathfindrLoader />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: -20, // Adjust based on Loader internal padding
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
