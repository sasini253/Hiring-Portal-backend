// Model imports
const ResponseService = require('./ResponseService'); // Response service
const Types = require('./Types') // Model types
const Applicant = require("../Models/Applicant/applicant");
const Applicantjob = require("../Models/Applicant/applicantjob");
const Cv = require("../Models/Applicant/cv");
const Job = require("../Models/Applicant/job");

// Return model by type
function getModelByType(type) {
    // eslint-disable-next-line default-case
    switch (type) {
        case Types.APPLICANT:
            return Applicant;
        case Types.APPLICANTJOB:
            return Applicantjob;
        case Types.CV:
            return Cv;
        case Types.JOB:
            return Job;
    }
}

// Create
exports.create = function (val, type, res) {
    const model = getModelByType(type);
    model.create(val)
        .then((confirm) => {
            ResponseService.generalPayloadResponse(null, { addedId: confirm.null }, res);
        }).catch(err => ResponseService.generalResponse(err, res));
}

// Delete by ID
exports.deleteById = function (id, type, res) {
    const model = getModelByType(type);
    model.destroy({ where: { id: id } })
        .then(posts => {
            ResponseService.generalPayloadResponse(null, posts, res);
        })
        .catch(err => ResponseService.generalPayloadResponse(err, null, res));

}

// Read all
exports.getAll = function (type, res) {
    const model = getModelByType(type);
    model.findAll()
        .then(posts => {
            ResponseService.generalPayloadResponse(null, posts, res);
        })
        .catch(err => ResponseService.generalPayloadResponse(err, null, res));
}

// Read one by ID
exports.getById = function (id, type, res) {
    const model = getModelByType(type);
    model.findOne({ where: { id: id } })
        .then(post => {
            if (post !== null)
                ResponseService.generalPayloadResponse(null, post, res);
            else ResponseService.generalPayloadResponse(null, post, res, 404, "No record Found");
        })
        .catch(err => ResponseService.generalPayloadResponse(err, null, res));
}

// Update one by ID
exports.updateById = function (val, id, type, res) {
    const model = getModelByType(type);
    model.update(val, { where: { id: id } })
    .then(rowsUpdated => {
        ResponseService.generalPayloadResponse(null, rowsUpdated, res);
    })
    .catch(err => ResponseService.generalPayloadResponse(err, null, res));
}

// search
exports.searchByQuery = function (search, type, res) {
    const model = getModelByType(type);
    model.findAll({ where: search })
        .then(posts => {
            ResponseService.generalPayloadResponse(null, posts, res);
        })
        .catch(err => ResponseService.generalPayloadResponse(err, null, res));
}
