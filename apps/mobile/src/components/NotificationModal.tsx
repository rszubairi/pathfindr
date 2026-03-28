import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  navigation: any;
}

export function NotificationModal({ visible, onClose, userId, navigation }: NotificationModalProps) {
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    { userId: userId as Id<'users'> }
  );
  
  const markAsRead = useMutation(api.notifications.markNotified);

  const handleNotificationPress = async (item: any) => {
    if (!item.notified) {
      await markAsRead({ notificationId: item._id });
    }
    onClose();
    navigation.navigate('ScholarshipDetail', { id: item.scholarshipId });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.notified && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.iconContainer}>
        <Feather name="award" size={20} color={item.notified ? "#64748b" : "#2563eb"} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.notifTitle, !item.notified && styles.unreadText]}>
          Scholarship Open: {item.scholarshipName}
        </Text>
        <Text style={styles.notifSubtitle}>
          The deadline is approaching: {item.deadline || 'Rolling'}
        </Text>
        <Text style={styles.notifTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {!item.notified && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <SafeAreaView style={styles.modalContent}>
          <TouchableOpacity activeOpacity={1} style={styles.innerContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Notifications ({notifications?.length || 0})</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#1e293b" />
              </TouchableOpacity>
            </View>
            
            {notifications && notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="bell-off" size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>No notifications yet</Text>
                <Text style={styles.emptySubtext}>We'll notify you when matching scholarships open up.</Text>
              </View>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 10,
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
  },
  innerContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#eff6ff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notifTitle: {
    fontSize: 14,
    color: '#334155',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  notifSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
  },
});
