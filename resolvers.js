import { Neo4jGraphQL } from "@neo4j/graphql";
import cookieParser from 'cookie-parser';
import neo4j from "neo4j-driver";
import typeDefs from "./schema.js"
import 'dotenv/config'

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
);


// todo : write tests for here


const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

 const resolvers = {
    Query: {

        todos(){
            return neoSchema._nodes
        },
        todo(_, args){
              //! the _ is "parent"  but don't needed here. there is a third one called context that we don't need it either
            return neoSchema._nodes.find(todo => todo.id === args.id)
        }
    },

    // ?     is this needed?
    // User: {
    //     todos(parent){
    //         return neoSchema._nodes.filter(u => u.id === parent.id)
    //     }
    // },

    Mutations: {
        addTodo(_, args){
            let todo = {
                ...args.todo, 
                id: Math.floor(Math.random() * 10000).toString()
              }
              db.todos.push(todo)
        
              return todo
        },  

        deleteTodo(_, args){
            db.todos = db.todos.filter((todo) => todo.id !== args.id)
    
            return db.todos
        },

        updateTodo(_, args){
            db.todos = db.todos.map((todo) => {
                if (todo.id === args.id) {
                  return {...todo, ...args.edits}
                }
        
                return todo
              })
        
              return db.todos.find((todo) => g.id === args.id)
        }
    }
}

export default resolvers;