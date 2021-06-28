const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    token: String!
    email: String!
    ownedEquipment: [String]
    programs: [Program]
  }
  type Program {
    _id: ID!
    name: String!
    token: String!
    days: Int!
    currentDay: Int!
    equipment: [String]
  }
  type PublicProgram {
    _id: ID!
    name: String!
    days: Int!
    equipment: [String]
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    relogin(token: String!): User!
    getPrograms: [PublicProgram]
  }
  type Mutation {
    login(userInput: UserInput): User!
  }
`;
