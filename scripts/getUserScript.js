async function getByEmail(usernameOrEmail, callback) {
  let client;

  try {
    const MongoClient = require("mongodb@4.1.0").MongoClient;

    client = new MongoClient(
      "mongodb+srv://auth0_user:" +
        configuration.new_password +
        "@cluster0.err5b9b.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      }
    );

    await client.connect();

    const db = client.db("test_db");
    const auth_user = db.collection("auth_user");
    const users = db.collection("efuse_user");

    const user = await auth_user.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    client.close();

    if (!user) {
      return callback(null);
    }

    return callback(null, {
      user_id: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    if (client) {
      client.close();
    }

    return callback(error);
  }
}