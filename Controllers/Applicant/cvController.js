const ResponseService = require('../../common/ResponseService'); // Response service
const Cv = require('../../Models/Applicant/cv'); // cv model

//upload CV
exports.uploadCv = (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    Cv.create(
        {
            applicant_id: req.body.applicant_id,
            cv_url: url + "/CVs/" + req.file.filename
        })
        .then((responce) => ResponseService.generalPayloadResponse(null, responce, res))
        .catch((err) => ResponseService.generalPayloadResponse(err, null, res));
};

//update CV
exports.updateCv = (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const id = req.params.id;
    Cv.update(
        {
            cv_url: url + "/CVs/" + req.file.filename
        },
        { where: { applicant_id: id } }
    )
        .then((responce) => ResponseService.generalPayloadResponse(null, responce, res))
        .catch((err) => ResponseService.generalPayloadResponse(err, null, res));
};
