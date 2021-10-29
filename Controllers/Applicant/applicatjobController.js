const { response } = require('express');
const ResponseService = require('../../common/ResponseService'); // Response service
const Applicantjob = require('../../Models/Applicant/applicantjob'); 
const Job = require('../../Models/Applicant/job'); 

// get Applicat Jobs From AppID
exports.getApplicatJobsFromAppID = (applicant_id, res) => {
    Applicantjob.belongsTo(Job, {foreignKey: 'job_id'})
    Job.hasMany(Applicantjob, {foreignKey: 'job_id'})
    Applicantjob.findAll({ where: { applicant_id:applicant_id }, include: [Job]})
    .then(response => {
        console.log(response)
        ResponseService.generalPayloadResponse(null, response, res);
    })
    .catch(err => ResponseService.generalPayloadResponse(err, null, res));
};
