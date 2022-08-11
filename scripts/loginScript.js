function login(email, password, callback) {
  const { compare } = require("bcrypt");
  const MongoClient = require("mongodb@3.1.4").MongoClient;
  const client = new MongoClient(
    "mongodb+srv://auth0_user:" +
      configuration.new_password +
      "@cluster0.err5b9b.mongodb.net/?retryWrites=true&w=majority"
  );

  client.connect(async (err) => {
    if (err) {
      return callback(err);
    }

    let result = {};

    try {
      const db = client.db("test_db");
      const users = db.collection("efuse_user");
      const secures = db.collection("auth_user");

      const user = await users.findOne({ email: email });
      if (!user) {
        throw new WrongUsernameOrPasswordError(email);
      }

      const secure = await secures.findOne({ email: user.email });
      if (!secure) {
        throw new WrongUsernameOrPasswordError(email);
      }

      const isValid = await compare(password, secure.password);
      if (!isValid) {
        throw new WrongUsernameOrPasswordError(email);
      }

      client.close();

      result = {
        email: user.email,
        profile_image: user.profilePicture.url,
        user_id: user._id.toString(),
      };
    } catch (error) {
      client.close();
      return callback(error || new WrongUsernameOrPasswordError(email));
    }

    return callback(null, result);
  });
}