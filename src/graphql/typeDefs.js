import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Message {
    id: String!
    role: String!
    text: String!
  }

  type ChatMetadata {
    id: String!
    title: String
    lastMessage: String
    timestamp: String
  }

  type Chat {
    chatId: String!
    userId: String!
    title: String
    lastMessage: String
    messages: [Message!]!
    updatedAt: String
  }

  input MessageInput {
    id: String!
    role: String!
    text: String!
  }

  type Query {
    getCurrentUser(email: String!): User
    getChatHistory(userId: String!): [ChatMetadata!]!
    getChat(chatId: String!, userId: String!): Chat
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    saveChat(chatId: String!, userId: String!, title: String, lastMessage: String, messages: [MessageInput!]!): Boolean
    deleteChat(chatId: String!, userId: String!): Boolean
  }
`;

export default typeDefs;
