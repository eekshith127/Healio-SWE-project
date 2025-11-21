import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import ChatBotInput from '../../components/chatbotinput';
import { sendChat } from '../../api/chatbotService';
import { globalStyles } from '../../styles/globalstyle';
import EmptyState from '../../components/emptystate';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatBotScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', isUser: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    // Get AI response from backend
    try {
      const response = await sendChat(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setError('Sorry, I encountered an error. Please try again.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Chat Bot</Text>
      {messages.length <= 1 ? (
        <EmptyState message="Start a conversation" subtitle="Ask me anything about health and wellness" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
              <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.botMessageText]}>
                {item.text}
              </Text>
            </View>
          )}
          style={styles.messagesList}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            ) : null
          }
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ChatBotInput onSend={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  messagesList: {
    flex: 1,
    marginVertical: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default ChatBotScreen;
