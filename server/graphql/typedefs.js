const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID!
    token: String!
    email: String!
    ownedEquipment: [String]
    programs: [Program]
  }
  type Exercise {
    name: String!
    repetitions: String!
    description: String!
  }
  type Program {
    _id: ID!
    name: String!
    token: String!
    length: Int!
    finishedDays: [Int]
    equipment: [String]
    description: String!
    price: Int!
  }
  type PublicProgram {
    _id: ID!
    name: String!
    length: Int!
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
    getEquipment: [String]
    getDay(program: String!, token: String!, day: Int!): [Exercise]
  }
  type Mutation {
    login(userInput: UserInput): User!
    finishProgram(program: String!, token: String!, day: Int!): ProgramDay!
    addEquipment(token: String!, equipment: String!): User!
    removeEquipment(token: String!, equipment: String!): User!
  }
`;
