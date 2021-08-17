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

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    relogin(token: String!): User!
    getPrograms: [PublicProgram]
    getEquipment: [String]
    getDay(program: String!, token: String!, day: Int!): [Exercise]
  }
  type Mutation {
    login(userInput: UserInput): User!
    finishDay(program: String!, token: String!, day: Int!): Boolean!
    restartProgram(program: String!, token: String!): Boolean!
    addEquipment(token: String!, equipment: String!): User!
    addProgram(token: String!, program: String!): User!
    removeEquipment(token: String!, equipment: String!): User!
  }
`;
