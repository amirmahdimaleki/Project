
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Neo4jGraphQL } from "@neo4j/graphql"
import cookieParser from 'cookie-parser'
import neo4j from "neo4j-driver"
import ogmPkg from  "@neo4j/graphql-ogm"
const  { OGM } = ogmPkg
import authPkg from "@neo4j/graphql-plugin-auth"
const  { Neo4jGraphQLAuthJWTPlugin } = authPkg
import { typeDefs } from "./schema.js"
import 'dotenv/config'
import { createJWT, comparePassword } from './utils.js'

// =====================================================================================

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
);

//  one way of accessing db created bt you.com
const catcher = () => {
  const session = driver.session();
  const cypherQuery = "MATCH (n) RETURN n";
  session.run(cypherQuery)
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
}



  console.log("===========================", catcher())
  
  //  ==================================================================================

const app = express()
app.use(express.json())
app.use(cookieParser())

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
const ogm = new OGM({ typeDefs, driver });
const User = ogm.model("User");

// ===================================================================================
// todo : fix this problem -> caused by db (look at logged data)
const resolvers = {
  //  Query: {

  //      todos(){
  //          console.log("todos")
  //          return neoSchema._nodes
  //      },
  //      todo(_, args){
  //          console.log("todos")

  //          return neoSchema._nodes.find(todo => todo.id === args.id)
  //               // _ (parent) and context args are not needed here
  //      }
  //  },

   // ? **  is this needed?
   
   Mutations: {
      //  addTodo(_, args){
      //      let todo = {
      //          ...args.todo, 
      //          id: Math.floor(Math.random() * 10000).toString()
      //        }
      //        db.todos.push(todo)
      //        console.log("todos")

      //        return todo
      //  },  

      //  deleteTodo(_, args){
      //      db.todos = db.todos.filter((todo) => todo.id !== args.id)
      //      console.log("todos")

      //      return db.todos
      //  },

      //  updateTodo(_, args){
      //      db.todos = db.todos.map((todo) => {
      //          if (todo.id === args.id) {
      //            return {...todo, ...args.edits}
      //          }
       
      //          return todo
      //        })
      //        console.log("todos")

      //        return db.todos.find((todo) => todo.id === args.id)
      //  },

      //  authentication set up
      // ----------------------------------------------------------------------------
       signUp: async (_source, { username, password }) => {
        const [existing] = await User.find({
            where: {
                username,
            },
        });
        if (existing) {
            throw new Error(`User with username ${username} already exists!`);
        }
        const { users } = await User.create({
            input: [
                {
                    username,
                    password,
                }
            ]
        });
        return createJWT({ sub: users[0].id });
    },
    // -------------------------------------------------------------------------------

    signIn: async (_source, { username, password }) => {
        const [user] = await User.find({
            where: {
                username,
            },
        });
        if (!user) {
            throw new Error(`User with username ${username} not found!`);
        }
        const correctPassword = await comparePassword(password, user.password);
        if (!correctPassword) {
            throw new Error(`Incorrect password for user with username ${username}!`);
        }
        return createJWT({ sub: user.id });
    },
  }

}


// =====================================================================================

const server = new ApolloServer({
   schema: await neoSchema.getSchema(),
   typeDefs,
   resolvers,
   plugins: {
    auth: new Neo4jGraphQLAuthJWTPlugin({
      secret: process.env.JWT_SECRET
    })
   }
});

Promise.all([neoSchema.getSchema(), ogm.init()]).then(([schema]) => {
  const server = new ApolloServer({
      schema,
  });

  startStandaloneServer(server, {
      context: async ({ req }) => ({ req }),
  }).then(({ url }) =>  {
      console.log(`🚀 Server ready at ${url}`);
  });
});


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