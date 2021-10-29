module.exports = {

    COMMON: {
        PREFIX: '/common',
        SEARCH: "/search"
    },

    APPLICANT: {
        PREFIX: '/applicants',
        HANDLE_SINGLE: "/applicant/:id",
        REGISTER: "/register",
        LOGIN: "/login",
        PW_RESET: "/pw-reset/:id",
        SEARCH: "/search",
    },

   

    APPLICANTJOB: {
        PREFIX: '/applicantjobs',
        HANDLE_SINGLE: "/applicantjob/:id",
        SEARCH: "/search",
        GET_JOBS: "/get-applied-jobs/:appId"
    },

    CV: {
        PREFIX: '/cvs',
        HANDLE_SINGLE: "/cv/:id",
        UPLOAD_CV: "/upload-cv",
        UPDATE_CV: "/update-cv/:id",
        SEARCH: "/search",
    },

    JOB: {
        PREFIX: '/jobs',
        HANDLE_SINGLE: "/job/:id",
        SEARCH: "/search",
    },
}
