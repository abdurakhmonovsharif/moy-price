const { Market, Connection } = require("../constants.js").models;
const { some } = require("lodash");

const getMarketByINN = async (req, res) => {
  try {
    const { market, inn } = req.body;

    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    if (inn.length < 9) {
      return res.status(400).json({
        message: "Diqqat! Do'kon INN si 9 raqamdan iborat bo'lishi kerak.",
      });
    }

    const secondMarket = await Market.findOne({ _id: { $ne: market }, inn })
      .select("name phone1 director inn connections")
      .populate("director", "firstname lastname phone");

    if (!secondMarket)
      return res.status(400).json({
        message: `Tizimda ${inn} raqamli INN ga ega bo'lgan do'kon ro'yxatdan o'tkazilmagan`,
      });

    res.status(200).send(secondMarket);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const createRequestToConnection = async (req, res) => {
  try {
    const { firstMarket, secondMarket } = req.body;

    if (firstMarket === secondMarket) {
      return res
        .status(403)
        .json({ message: "Diqqat! Do'konlarni bir xil tanladingiz" });
    }

    const first = await Market.findById(firstMarket);
    if (!first) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    const second = await Market.findById(secondMarket);

    if (!second) {
      return res.status(400).json({
        message: "Diqqat! So'rov yuboriladigan do'kon ma'lumotlari topilmadi",
      });
    }

    const connection = await Connection.findOne({
      first: firstMarket,
      second: secondMarket,
      request: true,
    });
    if (connection) {
      return res
        .status(403)
        .json({ message: "Diqqat! Ushbu do'konga avval so'rov yuborilgan." });
    }

    if (some(second.connections, firstMarket)) {
      return res.status(403).json({
        message:
          "Diqqat! So'rov yuboriladigan do'kon bilan avval aloqa o'rnatilgan.",
      });
    }

    await new Connection({
      first: firstMarket,
      second: secondMarket,
      request: true,
    }).save();
    res.status(201).json({ message: "So'rov muvaffaqiyatli yuborildi" });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const incomingRequestsToConnection = async (req, res) => {
  try {
    const { market } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    const connections = await Connection.find({ second: market })
      .sort({ request: -1, createdAt: -1 })
      .select("first second createdAt request accept rejected")
      .populate({
        path: "first",
        select: "name phone1 inn director",
        populate: {
          path: "director",
          select: "firstname phone lastname",
        },
      });

    res.status(200).json(connections);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const sendingRequestsToConnection = async (req, res) => {
  try {
    const { market } = req.body;

    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    const connections = await Connection.find({ first: market })
      .sort({ request: -1, createdAt: -1 })
      .select("second first createdAt request accept rejected")
      .populate({
        path: "second",
        select: "name phone1 inn director",
        populate: {
          path: "director",
          select: "firstname phone lastname",
        },
      });

    res.status(200).json(connections);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const getNewRequestToConnection = async (req, res) => {
  try {
    const { market } = req.body;

    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    const connections = await Connection.find({
      second: market,
      request: true,
    })
      .select("second first createdAt request accept rejected")
      .populate({
        path: "first",
        select: "name phone1 inn director",
        populate: {
          path: "director",
          select: "firstname phone lastname",
        },
      });
    res.status(200).json({ count: connections.length });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const answerToRequest = async (req, res) => {
  try {
    const { market, connection } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData || connection.second !== market) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    if (connection.accept) {
      const firstMarket = await Market.findById(connection.first).and([
        { connections: connection.second },
      ]);
      const secondMarket = await Market.findById(connection.second).and([
        { connections: connection.first },
      ]);
      !firstMarket &&
        (await Market.findByIdAndUpdate(connection.first, {
          $push: { connections: connection.second },
        }));
      !secondMarket &&
        (await Market.findByIdAndUpdate(connection.second, {
          $push: { connections: connection.first },
        }));
    }
    if (connection.rejected) {
      await Market.findByIdAndUpdate(connection.first, {
        $pull: { connections: connection.second },
      });

      await Market.findByIdAndUpdate(connection.second, {
        $pull: { connections: connection.first._id },
      });
    }

    await Connection.findByIdAndUpdate(connection._id, {
      request: connection.request,
      accept: connection.accept,
      rejected: connection.rejected,
    });

    const updatedConnection = await Connection.findById(connection._id)
      .select("first second createdAt request accept rejected")
      .populate({
        path: "first",
        select: "name phone1 inn director",
        populate: {
          path: "director",
          select: "firstname phone lastname",
        },
      });
    if (!updatedConnection) {
      return res.status(400).json({ message: "So'rov topilmadi" });
    }

    res.status(202).json(updatedConnection);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const deleteRequestToConnection = async (req, res) => {
  try {
    const { market, connectionId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    const connection = await Connection.findByIdAndDelete(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "So'rov topilmadi" });
    }

    res.status(202).json({ message: "So'rov muvaffaqiyatli o'chirildi" });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

const getConnectionMarkets = async (req, res) => {
  try {
    const { market } = req.body;

    const marketData = await Market.findById(market).populate({
      path: "connections",
      select: "name phone1 inn director image",
      populate: {
        path: "director",
        select: "firstname phone lastname image",
      },
    });
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }

    res.status(200).json({ connections: marketData.connections });
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

module.exports = {
  getMarketByINN,
  createRequestToConnection,
  incomingRequestsToConnection,
  sendingRequestsToConnection,
  getNewRequestToConnection,
  answerToRequest,
  deleteRequestToConnection,
  getConnectionMarkets,
};
