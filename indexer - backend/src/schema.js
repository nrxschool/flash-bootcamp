const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String!
    stake: String! # Usando String para valores grandes
    createdAt: String!
    completedAt: String
    dueDate: String!
    isCompleted: Boolean!
    owner: String!
  }

  input TaskWhereInput {
    owner: String
    isCompleted: Boolean
  }

  input ClientInput {
    brazilian: Boolean
  }

  type Query {
    tasks(where: TaskWhereInput): [Task!]!
  }
`;

module.exports = { typeDefs }; 