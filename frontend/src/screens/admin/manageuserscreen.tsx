import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, TextInput, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsersStore, User } from '../../store/usersstore';
import { deleteUser as apiDeleteUser, updateUser as apiUpdateUser } from '../../api/mockapi';
import { colors } from '../../styles/colors';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';

const ManageUsersScreen: React.FC = () => {
  const { users, loading, error, loadUsers, updateUser, deleteUser: removeUser } = useUsersStore();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUsers();
    // Auto-refresh every 10 seconds for real-time user tracking
    const interval = setInterval(loadUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = users;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

  const handleDelete = async (id: string, name: string) => {
    Alert.alert('Delete User', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDeleteUser(id);
            removeUser(id);
            Alert.alert('Success', `✅ ${name} has been deleted!\n\nChanges are live across all screens.`);
          } catch (err) {
            Alert.alert('Error', 'Failed to delete user');
          }
        },
      },
    ]);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      await apiUpdateUser(editingUser.id, editingUser as any);
      updateUser(editingUser.id, editingUser);
      setModalVisible(false);
      Alert.alert('Success', '✅ User updated successfully!\n\nChanges are live across all screens.');
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'patient': return colors.primary;
      case 'doctor': return '#6366f1';
      case 'lab': return '#10b981';
      case 'admin': return '#f59e0b';
      default: return colors.secondary;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const onRefresh = React.useCallback(() => {
    handleRefresh();
  }, []);

  if (loading) {
    return <Loading message="Loading users..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadUsers} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, '#ff6b9d']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Manage Users</Text>
        <Text style={styles.headerSubtitle}>{filteredUsers.length} {filterRole === 'all' ? 'total' : filterRole} users</Text>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Role Filter */}
      <View style={styles.filterContainer}>
        {['all', 'patient', 'doctor', 'lab', 'admin'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterButton,
              filterRole === role && styles.filterButtonActive,
            ]}
            onPress={() => setFilterRole(role)}
          >
            <Text style={[
              styles.filterButtonText,
              filterRole === role && styles.filterButtonTextActive,
            ]}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Loading message="Loading users..." />
      ) : error ? (
        <ErrorView message={error} onRetry={loadUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState 
          message="No users found" 
          subtitle="Try adjusting your search or filters" 
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[getRoleBadgeColor(item.role), getRoleBadgeColor(item.role) + 'AA']}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </LinearGradient>
                  {item.isOnline && (
                    <View style={styles.onlineIndicator}>
                      <View style={styles.onlineDot} />
                    </View>
                  )}
                </View>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.isOnline && (
                      <View style={styles.onlineBadge}>
                        <Text style={styles.onlineBadgeText}>🟢 Online</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <View style={styles.userMeta}>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(item.role) + '20' }]}>
                      <Text style={[styles.roleBadgeText, { color: getRoleBadgeColor(item.role) }]}>
                        {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.lastActive}>• {item.isOnline ? 'Just now' : getTimeAgo(item.lastActive)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={[styles.actionButtonText, { color: colors.primary }]}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#dc354520' }]}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Text style={[styles.actionButtonText, { color: '#dc3545' }]}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            {editingUser && (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Name"
                  value={editingUser.name}
                  onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={editingUser.email}
                  onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Phone"
                  value={editingUser.phone}
                  onChangeText={(text) => setEditingUser({ ...editingUser, phone: text })}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleSaveUser}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 15,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  onlineBadge: {
    backgroundColor: '#28a74515',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  onlineBadgeText: {
    fontSize: 11,
    color: '#28a745',
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lastActive: {
    fontSize: 12,
    color: colors.secondary,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManageUsersScreen;