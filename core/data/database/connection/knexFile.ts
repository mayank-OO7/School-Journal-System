import { env } from "../../../utils/envalidUtils";

const DB_NAME = env.DB_NAME;
const DB_PASSWORD = env.DB_PASSWORD;
export default {
  client: "pg",
  connection: {
    host: env.DB_HOSTNAME,
    user: env.DB_USERNAME,
    password: DB_PASSWORD,
    database: env.DB_NAME,
    port: 5432,
  },
  // connection:
  //   "postgres://jatin:EjrEeYgtzC5oFxwLsiWxa8QSfg0S99Qc@dpg-ci7c6uenqql0ldart170-a.singapore-postgres.render.com/jouralmanagerdb",
};
