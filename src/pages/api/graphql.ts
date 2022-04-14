import { gql, ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = gql`
    type User @exclude(operations: [CREATE, UPDATE, DELETE]) {
        username: String! @id
        gamesPlaying: [Game!] @relationship(type: "IS_PLAYING", properties: "Status", direction: OUT)
        gamesCompleted: [Game!] @relationship(type: "HAS_COMPLETED", properties: "Status", direction: OUT)
        gamesPaused: [Game!] @relationship(type: "HAS_PAUSED", properties: "Status", direction: OUT)
        gamesDropped: [Game!] @relationship(type: "HAS_DROPPED", properties: "Status", direction: OUT)
        gamesPlanning: [Game!] @relationship(type: "IS_PLANNING", properties: "Status", direction: OUT)
    }

    type Game @exclude(operations: [CREATE, UPDATE, DELETE]) {
        id: ID!
        title: String
        developer: String
        publisher: String
        genre: Genre
        summary: String
        usersPlaying: [User!] @relationship(type: "IS_PLAYING", properties: "Status", direction: IN)
        usersCompleted: [User!] @relationship(type: "HAS_COMPLETED", properties: "Status", direction: IN)
        usersPaused: [User!] @relationship(type: "HAS_PAUSED", properties: "Status", direction: IN)
        usersDropped: [User!] @relationship(type: "HAS_DROPPED", properties: "Status", direction: IN)
        usersPlanning: [User!] @relationship(type: "IS_PLANNING", properties: "Status", direction: IN)
    }

    interface Status @relationshipProperties {
        hours: Int
        score: Int
    }

    enum Genre {
        adventure
        board
        fighting
        horror
        racing
        rpg
        rhythm
        sandbox
        shooter
        simulation
        sports
        strategy
    }
`;

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export default async function handler(req: any, res: any) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    const apolloServer = new ApolloServer({ schema: await neoSchema.getSchema() });
    await apolloServer.start();
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false,
    },
};
