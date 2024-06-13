const {
  getProductsByCount,
  getAllFilials,
  getPartnerProducts,
} = require("./socketFunctions.js");
const jwt = require("jsonwebtoken");
const config = require("config");
const socketIO = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const market = socket.handshake.auth.market;
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    !decoded &&
      socket.emit("error", {
        id: market,
        message: "Avtorizatsiyadan o'tilmagan'",
      });
    next();
  });
  io.on("connection", (socket) => {
    socket.on("getProductsOfCount", async ({ market }) => {
      await getProductsByCount({
        socket,
        market,
      });
    });
    socket.on("getAllFilials", async ({ market }) => {
      await getAllFilials({
        socket,
        market,
      });
    });
    socket.on("getPartnerProducts", async ({ market, partner }) => {
      await getPartnerProducts({ socket, market, partner });
    });
  });
};

module.exports = { socketIO };
