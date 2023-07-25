import express from 'express'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import cookieParser from 'cookie-parser';
import neo4j from "neo4j-driver";
import {typeDefs} from "./schema.js"
// import resolvers from './resolvers.js';
import 'dotenv/config'
// import cors from 'cors'

// =====================================================================================

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
);

// accessing db
const session = driver.session();
const cypherQuery = "MATCH (n) RETURN n";
const data = session.run(cypherQuery)
  .then(result => {
    result.records.forEach(record => {
      // Access data for each node, e.g. record.get('n').properties
      console.log(record.get('n').properties);
    });
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    session.close();
    driver.close();
  });


  console.log("===========================",)
//  ==================================================================================

const app = express()
app.use(express.json())
app.use(cookieParser()
)
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// ===================================================================================

const resolvers = {
   Query: {

       todos(){
           console.log("todos")
           return neoSchema._nodes
       },
       todo(_, args){
           console.log("todos")

// the _ is "parent"  but don't needed here. there is a third one called context that we don't need it either
           return neoSchema._nodes.find(todo => todo.id === args.id)
       }
   },

   // ?   **  is this needed?
   
   Mutations: {
       addTodo(_, args){
           let todo = {
               ...args.todo, 
               id: Math.floor(Math.random() * 10000).toString()
             }
             db.todos.push(todo)
             console.log("todos")

             return todo
       },  

       deleteTodo(_, args){
           db.todos = db.todos.filter((todo) => todo.id !== args.id)
           console.log("todos")

           return db.todos
       },

       updateTodo(_, args){
           db.todos = db.todos.map((todo) => {
               if (todo.id === args.id) {
                 return {...todo, ...args.edits}
               }
       
               return todo
             })
             console.log("todos")

             return db.todos.find((todo) => g.id === args.id)
       }
   }
}

// =====================================================================================

const server = new ApolloServer({
   schema: await neoSchema.getSchema(),
   typeDefs,
   resolvers
});
const { url } = await startStandaloneServer(server, {
   context: async ({ req }) => ({ req }),
   listen: { port: 4000 },
});
console.log(` Server running at ${url}`);


app.listen(4001 ,(err) => {
  err && console.log("Error")
  console.log('server is ready')
})


// ====================================================================================


// -> ** User: {
   //  .   todos(parent){
   //         return neoSchema._nodes.filter(u => u.id === parent.id)
   //     }
   // },