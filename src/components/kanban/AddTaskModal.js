// Add Task Modal component
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Input, Button, Select } from '../common';
import { SPACING, DEFAULT_USERS, KANBAN_COLUMNS } from '../../utils/constants';

const AddTaskModal = ({ visible, onClose, onAdd, initialStatus = 'todo' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validate()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || new Date().toISOString(),
        assignedUser: DEFAULT_USERS.find((u) => u.id === assignedUser)?.name || '',
        estimatedHours: parseFloat(estimatedHours) || 0,
        status,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignedUser('');
    setEstimatedHours('');
    setStatus(initialStatus);
    setErrors({});
    onClose();
  };

  const statusOptions = KANBAN_COLUMNS.map((col) => ({
    id: col.id,
    name: col.title,
  }));

  return (
    <Modal visible={visible} onClose={handleClose} title="New Task">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <Input
            label="Description (Optional)"
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
          
          <Select
            label="Status"
            value={status}
            options={statusOptions}
            onSelect={setStatus}
            placeholder="Select status"
          />
          
          <Select
            label="Assign To (Optional)"
            value={assignedUser}
            options={DEFAULT_USERS}
            onSelect={setAssignedUser}
            placeholder="Select team member"
          />
          
          <Input
            label="Estimated Hours (Optional)"
            placeholder="e.g., 4"
            value={estimatedHours}
            onChangeText={setEstimatedHours}
            keyboardType="numeric"
          />
          
          <View style={styles.buttons}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="ghost"
              style={styles.button}
            />
            <Button
              title="Create Task"
              onPress={handleAdd}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 500,
  },
  content: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.lg,
    zIndex: -1,
  },
  button: {
    marginLeft: SPACING.md,
  },
});

export default AddTaskModal;
