// Add Project Modal component
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Input, Button } from '../common';
import { SPACING } from '../../utils/constants';

const AddProjectModal = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      onAdd(title.trim(), description.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title="New Project">
      <View style={styles.content}>
        <Input
          label="Project Title"
          placeholder="Enter project title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />
        <Input
          label="Description (Optional)"
          placeholder="Enter project description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
        <View style={styles.buttons}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="ghost"
            style={styles.button}
          />
          <Button
            title="Create Project"
            onPress={handleAdd}
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: SPACING.md,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
  },
  button: {
    marginLeft: SPACING.md,
  },
});

export default AddProjectModal;
