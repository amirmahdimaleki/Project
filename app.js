import express from 'express'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import cookieParser from 'cookie-parser';
import neo4j from "neo4j-driver";
import typeDefs from "./schema.js"
import resolvers from './resolvers.js';
import 'dotenv/config'
// import cors from 'cors'

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
);



const app = express()
app.use(express.json())
app.use(cookieParser()
)



const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
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