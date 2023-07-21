//* define gql types here (schema)

//todo maybe the done field should be an array to work easier with -> canceled

export const typeDefs =`#graphql
    type Todo{
        id: ID!
        title: String!
        description: String,
        done:Boolean!
    }

    # Query type is necessary 
    type Query{
        Todos: [Todo]
        todo(id: ID!): Todo
    }
`