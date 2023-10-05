import knex, { Knex } from "knex";
import { env } from "../../../utils/envalidUtils";
import { logger } from "../../../utils/winstonLogger";
import knexConfig from "./knexFile";
const DB_NAME = env.DB_NAME;
const DB_PASSWORD = env.DB_PASSWORD;

// logger.info(`DB_STRING: ${DB_STRING}`);

const dbConnection = knex(knexConfig);

export default dbConnection;

// // Function to create a new database or connect to an existing one
// export async function connectToDatabase(databaseName: string) {
//   try {
//     // Check if the database exists
//     const databaseExists = await dbConnection.raw(
//       `SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`
//     );

//     if (databaseExists.rowCount === 0) {
//       // Create a new database if it doesn't exist
//       await dbConnection.raw(`CREATE DATABASE ${databaseName}`);
//       logger.info(`Database ${databaseName} created successfully!`);
//     } else {
//       // Use the existing database
//       logger.info(`Connecting to existing database ${databaseName}`);
//     }

//     // Update the connection configuration to use the new/existing database
//     dbConnection.client.config.connection.database = databaseName;
//   } catch (error) {
//     logger.error(`Failed to connect to database ${databaseName}:`, error);
//   }
// }

// // Usage example
// connectToDatabase("new_database")
//   .then(() => {
//     // Use the connection for further operations
//     // e.g., executing queries, defining models, etc.
//   })
//   .catch((error) => {
//     logger.error("Failed to connect to the database:", error);
//   });
