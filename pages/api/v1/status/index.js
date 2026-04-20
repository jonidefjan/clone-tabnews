import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postegressVersion = await database.query("SHOW server_version;");
  const version = postegressVersion.rows[0].server_version;

  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionsValue = parseInt(maxConnections.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const currentConnections = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const currentConnectionsValue = currentConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      version: version,
      max_connections: maxConnectionsValue,
      current_connections: currentConnectionsValue,
    },
  });
}

export default status;
