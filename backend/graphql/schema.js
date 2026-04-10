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

  type InventoryItem {
    id: ID!
    sku: String!
    slug: String!
    productName: String!
    shortDescription: String!
    longDescription: String!
    color: String!
    size: String!
    quantity: Int!
    price: Float!
    imageUrls: [String!]!
    createdByEmployeeId: String!
    createdAt: String!
    updatedAt: String!
  }

  type PublicProduct {
    id: ID!
    slug: String!
    name: String!
    shortDescription: String!
    description: String!
    price: Float!
    images: [String!]!
    quantity: Int!
    color: String!
    size: String!
    sku: String!
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
    inventoryItems: [InventoryItem!]!
    publicProducts: [PublicProduct!]!
    publicProductBySlug(slug: String!): PublicProduct
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

    createInventoryItem(
      sku: String!
      productName: String!
      shortDescription: String!
      longDescription: String!
      color: String!
      size: String!
      quantity: Int!
      price: Float!
      imageUrls: [String!]!
    ): InventoryItem!
    updateInventoryItem(
      id: ID!
      sku: String!
      productName: String!
      shortDescription: String!
      longDescription: String!
      color: String!
      size: String!
      quantity: Int!
      price: Float!
      imageUrls: [String!]!
    ): InventoryItem!
  }
`);

module.exports = { schema };
