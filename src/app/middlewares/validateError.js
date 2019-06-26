/* Libraries */

module.exports = async error => {
  try {
    let { message } = error;
    if (!message) return "Bad Request";
    message = message.split(":");
    let send = message[message.length - 1].toString();
    if (message[0] === "E11000 duplicate key error collection") {
      let send2 = message[message.length - 3].toString();
      send = send2.concat(" ", send);
    }
    return send;
  } catch (error) {
    return "Bad Request";
  }
};
