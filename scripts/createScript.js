async function create(incomingUser, callback) {
  const SALT = 10;
  let client;

  try {
    const bcrypt = require("bcrypt");
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
    const users = db.collection("efuse_user");
    const secures = db.collection("auth_user");

    // Make sure email is not already taken
    const userWithEmail = await users.findOne({ email: incomingUser.email });
    if (userWithEmail) {
      client.close();
      return callback(
        new ValidationError("user_exists", "Email has already been taken")
      );
    }

    // Validate username only when it is passed
    if (incomingUser.username) {
      // Make sure username is not already taken
      const userWithUsername = await users.findOne({
        username: incomingUser.username,
      });
      if (userWithUsername) {
        client.close();
        return callback(
          new ValidationError(
            "username_exists",
            "Username has already been taken"
          )
        );
      }
    }

    const passwordHash = bcrypt.hashSync(incomingUser.password, SALT);

    const newUser = await secures.insertOne({
      email: incomingUser.email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newSecuredObject = await users.insertOne({
      _id: newUser.insertedId,
      email: incomingUser.email,
      profilePicture: {
        url: "https://cdn.efuse.gg/uploads/static/global/mindblown_white.png",
        contentType: "image/png",
        filename: "mindblown_white.png",
      },
      discord_verfied: false,
      google_verfied: false,
      twitch_verfied: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    client.close();

    return callback(null);
  } catch (error) {
    if (client) {
      client.close();
    }

    return callback(error);
  }
}