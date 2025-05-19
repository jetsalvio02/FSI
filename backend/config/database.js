import Mysql from "mysql2/promise";

const connection = Mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "FSI",
});
export default connection;
