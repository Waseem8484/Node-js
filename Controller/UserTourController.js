const data = require("../Model/UserTourMuduler");
const express = require("express");
const app = express();
// express middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
exports.getAllData = async (req, res) => {
  try {
    const quiz = await data.find(req.query);
    res.status(200).json({
      status: "success",
      TotalPages: quiz.length,
      data: {
        tours: quiz,
      },
    });
  } catch (error) {}
};

// get api by id methed
exports.getTourById = async (req, res) => {
  const quiz = await data.findById(req.params.id);
  try {
    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// post api methed

exports.postData = async (req, res) => {
  const quiz = await data.create(req.body);
  try {
    const savePost = await quiz.save();
    res.status(201).json({
      status: "success",
      data: {
        tours: savePost,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// Patch Api methed
exports.PatchData = async (req, res) => {
  const quiz = await data.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(200).json({
      status: "success",
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// deleteApi Methd

exports.DeleteData = async (req, res) => {
  try {
    await data.findByIdAndDelete(req?.params?.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
