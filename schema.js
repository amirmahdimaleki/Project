//* define gql types here (schema)

 const typeDefs =`#graphql
    type Todo{
        id: ID!
        title: String!
        description: String,
        done:Boolean!
    }

    # Query type is necessary 
    type Query{
        todos: [Todo]
        todo(id: ID!): Todo
    }
    # Mutation type is for when we make a change on db like delete or update etc;
    type Mutation{
        addTodo(todo: addtodoInput!) : Todo
        deleteTodo(id: ID!) : [Todo]
        updateTodo(id: ID!, edits: editTodoInput) : Todo 
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

export default typeDefs