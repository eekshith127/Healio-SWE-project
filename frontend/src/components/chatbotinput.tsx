import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

interface ChatBotInputProps {
  onSend: (message: string) => void;
}

const ChatBotInput: React.FC<ChatBotInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <View style={globalStyles.inputContainer}>
      <TextInput
        style={globalStyles.textInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
      />
      <TouchableOpacity style={globalStyles.sendButton} onPress={handleSend}>
        <Text style={globalStyles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatBotInput;