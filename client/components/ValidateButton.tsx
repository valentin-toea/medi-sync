import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ValidateButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function ValidateButton({ onPress, disabled = false }: ValidateButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        Validate
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  disabledButton: {
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4285F4',
  },
  disabledText: {
    color: '#ccc',
  },
});