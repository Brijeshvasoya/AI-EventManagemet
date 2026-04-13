import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($userId: String!) {
    getChatHistory(userId: $userId) {
      id
      title
      lastMessage
      timestamp
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($chatId: String!, $userId: String!) {
    getChat(chatId: $chatId, userId: $userId) {
      chatId
      title
      lastMessage
      messages {
        id
        role
        text
      }
    }
  }
`;

export const SAVE_CHAT_MUTATION = gql`
  mutation SaveChat($chatId: String!, $userId: String!, $title: String, $lastMessage: String, $messages: [MessageInput!]!) {
    saveChat(chatId: $chatId, userId: $userId, title: $title, lastMessage: $lastMessage, messages: $messages)
  }
`;

export const DELETE_CHAT_MUTATION = gql`
  mutation DeleteChat($chatId: String!, $userId: String!) {
    deleteChat(chatId: $chatId, userId: $userId)
  }
`;
