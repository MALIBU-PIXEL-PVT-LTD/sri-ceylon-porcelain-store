const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Staff {
    id: ID!
    employeeId: String!
    fullName: String!
    email: String!
    phone: String
    department: String!
    role: String!
    isDisabled: Boolean!
    createdAt: String!
  }

  type RegistrationPayload {
    staff: Staff!
    tempPassword: String!
  }

  type AuthPayload {
    token: String!
    staff: Staff!
  }

  type CustomerAuthUser {
    id: ID!
    firebaseUid: String!
    email: String!
    displayName: String
    provider: String!
    isDisabled: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    health: String!
    message: String!
    dbTime: String!
    nextEmployeeId: String!
    nextPassword: String!
    me: Staff
    staffUsers: [Staff!]!
    customerAuthUsers: [CustomerAuthUser!]!
  }

  type Mutation {
    registerStaff(
      fullName: String!
      email: String!
      phone: String
      department: String!
      role: String!
    ): RegistrationPayload!

    loginStaff(
      employeeId: String!
      password: String!
    ): AuthPayload!
    setStaffAccountDisabled(id: ID!, disabled: Boolean!): Staff!
    deleteStaffAccount(id: ID!): Boolean!

    syncCustomerAuthUser(idToken: String!): CustomerAuthUser!
    setCustomerAccountDisabled(firebaseUid: String!, disabled: Boolean!): CustomerAuthUser!
    deleteCustomerAccount(firebaseUid: String!): Boolean!
  }
`);

module.exports = { schema };
