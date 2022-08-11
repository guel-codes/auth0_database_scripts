async function verify(email, callback) {
  let client;
  const MongoClient = require("mongodb@4.1.0").MongoClient;

  client = new MongoClient(
    "mongodb+srv://auth0_user:" +
      configuration.new_password +
      "@cluster0.err5b9b.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  );

  client.connect(function (err) {
    if (err) callback(err);

    const db = client.db("test_db");
    const efuse_user = db.collection("efuse_user");

    const query = { email: email, verified: false };

    efuse_user.update(
      query,
      { $set: { verified: true } },
      function (err, result) {
        client.close();

        if (err) return callback(err);
        callback(null, result.result.n > 0);
      }
    );
  });
}
