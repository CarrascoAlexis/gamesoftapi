const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "localhost",
      user: "gamesoft",
      password: "GameSoft01!",
      database: "gamesoft",
      connectTimeout: 60000
    },
    listPerPage: 10,
    trustedsIp: ["::ffff:90.22.166.219"]
  };
module.exports = config;