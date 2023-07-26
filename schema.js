//* define gql types here (schema)

 export const typeDefs =`#graphql
    type Todo{
        id: ID!
        title: String!
        description: String,
        done:Boolean!
        author: User!
    }
    type User{
        id: ID! @id
        username: String!
        password: String! @private
        todo: [Todo!]
    }

    # Query type is necessary 
    type Query{
        todos: [Todo]
        todo(id: ID!): Todo
        users: [User]
        user(id: ID!): User
    }
    # Mutation type is for when we make a change on db like delete or update etc;
    type Mutation{
        addTodo(todo: addtodoInput!) : Todo
        deleteTodo(id: ID!) : [Todo]
        updateTodo(id: ID!, edits: editTodoInput) : Todo \
        signUp(username: String!, password: String!): String! ### JWT
        signIn(username: String!, password: String!): String! ### JWT
    }

    # inputs
    input addtodoInput{
        title: String!
        description: String,
        done: Boolean!
    }
    input editTodoInput{
        title: String,
        description: String,
        done: Boolean!
    }
`



const userSchema = `#graphql
    type email{
        id:ID!
        required: true
    }
`
