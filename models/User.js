// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
// import { Neo4jGraphQL } from "@neo4j/graphql";
// import neo4j from "neo4j-driver";
// import 'dotenv/config'
// const typeDefs = require('../schema')

// const driver = neo4j.driver(
//     process.env.NEO4J_URI,
//     neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
// );

// // * a new a schema using defined types
// const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// const server = new ApolloServer({
//     schema: await neoSchema.getSchema(),
//  });

 
// const { url } = await startStandaloneServer(server, {
//     context: async ({ req }) => ({ req }),
//     listen: { port: 4000 },
//  });

//  console.log(` Server running at ${url}`);
 