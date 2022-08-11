function remove(id, callback) {
  const MongoClient = require("mongodb@3.1.4").MongoClient;
  const client = new MongoClient(
    "mongodb+srv://auth0_user:" +
      configuration.new_password +
      "@cluster0.err5b9b.mongodb.net/?retryWrites=true&w=majority"
  );

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db("test_db");
    const users = db.collection("efuse_user");
    const auth_user = db.collection("auth_user");

    users.deleteOne({ _id: ObjectID(id) }, function (err) {
      client.close();

      if (err) return callback(err);
      callback(null);
    });
    auth_user.deleteOne({ _id: ObjectID(id) }, function (err) {
      client.close();

      if (err) return callback(err);
      callback(null);
    });
  });
}