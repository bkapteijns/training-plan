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
    description: String!
    price: Int!
  }
  type PublicProgram {
    _id: ID!
    name: String!
    days: Int!
    equipment: [String]
    description: String!
    price: Int!
  }
  type ProgramDay {
    _id: ID!
    name: String!
    finished: Boolean!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    relogin(token: String!): User!
    getPrograms: [PublicProgram]
    getProgram(program: String!, token: String!, day: Int!): ProgramDay!
  }
  type Mutation {
    login(userInput: UserInput): User!
    finishProgram(program: String!, token: String, day: Int!): ProgramDay!
  }
`;
