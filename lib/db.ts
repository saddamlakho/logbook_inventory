// import { Pool } from "pg";

// function getPool() {
//   const host = process.env.DB_HOST || "localhost";
//   const port = parseInt(process.env.DB_PORT || "5432");
//   const database = process.env.DB_NAME || "inventory_db";
//   const user = process.env.DB_USER || "postgres";
//   const password = process.env.DB_PASSWORD;

//   if (!password) {
//     throw new Error(
//       "DB_PASSWORD is not set! Please create a .env file and set DB_PASSWORD=your_postgres_password"
//     );
//   }

//   return new Pool({
//     host,
//     port,
//     database,
//     user,
//     password,
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 5000,
//   });
// }

// const pool = getPool();

// export default pool;



// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === "production" 
//     ? { rejectUnauthorized: false } 
//     : false,
// });

// export default pool;





import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
});

export default pool;