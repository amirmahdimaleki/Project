// ^ dear reviewer, sorry for my codes untidiness caused by lack of time, I know it could be much cleaner 

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

 const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)

const session = driver.session()
//  ==================================================================================

const app = express()
app.use(express.json())
app.use(cookieParser())

const ogm = new OGM({ typeDefs, driver });
const User = ogm.model("User");


// ===================================================================================

const resolvers = {
  //~ user field inspired by dear Negar Miralaei's project 
   User: {
    // !Typically you do not need to write this bc it is automatically generated in neo4-graphql but in that way, If you query for users and their todos, if that user does not have any todo, it will throw an error bc nothing should be null in neo4j-graphql, so for returning null, empty array, you must create this on your own!
    todos: async (parent, args, context, info) => {
        const todos = await session.run(`MATCH (u:User {id: "${parent.id}"})-[:HAS_TODO]->(t:Todo) RETURN t`);
    
        // If todos or todos.records is null or not an array, return an empty array
        if (!todos || !Array.isArray(todos.records)) {
            return [];
        }
    
        return todos.records.map(record => record.get('t').properties);
    },
},

   Mutation: {
  
       // ^ authentication set up
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

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  resolvers,
  plugins: {
      auth: new Neo4jGraphQLAuthJWTPlugin({
          secret: process.env.JWT_SECRET
      })
  }
});

// =====================================================================================

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

