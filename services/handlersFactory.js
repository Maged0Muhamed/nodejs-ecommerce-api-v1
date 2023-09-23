const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.params.categoryId) filter = { category: req.params.categoryId };
    if (req.filterObj) filter = req.filterObj;
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate()
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
    const models = await apiFeatures.mongooseQuery;

    res.status(200).json({ results: models.length, data: models });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const document = await query;
    if (!document) {
      // res.status(404).json({ msg: `no document for this id => ${id}` });
      return next(new ApiError(`no document for this id => ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // req.body.slug = slugify(req.body.name);
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      // res.status(404).json({ msg: `no document for this id => ${id}` });
      return next(
        new ApiError(`no document for this id => ${req.params.id}`, 404)
      );
    }
    //Trigger save event when update document
    document.save();
    res.status(203).json(document);
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`no document found for this id ${id}`, 404));
      // res.status(404).json({ msg: `no document found for this id ${id}` });
    }
    //Trigger save event when update document
    document.remove();
    res.status(204).send();
  });
