const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });
};
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model, populationOpt) => {
  return asyncHandler(async (req, res, next) => {
    // Build query
    let query = Model.findOneById(req.params.id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    // Execute query
    const document = await query;
    if (!document) {
      return next(
        new ApiError("There is not doc for this id => ${req.params.id}", 404)
      );
    }

    res.status(200).json({ data: document });
  });
};
exports.updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError("There is not doc for this id => ${req.params.id}", 404)
      );
    }
    // Trigger "save" event when update document
    document.save();

    res.status(200).json({ data: document });
  });
};
exports.deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new ApiError("There is not doc for this id => ${req.params.id}", 404)
      );
    }
    // Trigger "remove" event when update document
    document.remove();

    res.status(204).json({ data: document });
  });
};
