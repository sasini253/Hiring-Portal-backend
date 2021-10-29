const bcrypt = require("bcryptjs");//password encript module
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const ResponseService = require('../../common/ResponseService'); // Response service
const Applicant = require('../../Models/Applicant/applicant'); // applicant model

// signUp
exports.signUp = function (req, res) {
    var validEmailRegex = RegExp(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    Applicant.findOne({ where: { email: req.body.email } }).then((user) => {

        if (req.body.f_name.length < 3) {
            fnameerr = "First Name must be 3 characters long!";
            return res.status(400).json(fnameerr);
        } else if (req.body.email.length == 0) {
            emailerr = "Email is empty";
            return res.status(400).json(emailerr);
        } else if (!validEmailRegex.test(req.body.email)) {
            emailerr = "Email is not valid!";
            return res.status(400).json(emailerr);
        } else if (req.body.pw.length < 6) {
            passerr = "Password must be 6 characters long!";
            return res.status(400).json(passerr);
        }
        else if (user) {
            emailerr = "Email already exists";
            return ResponseService.generalPayloadResponse(emailerr, null, res);
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.pw, salt, (err, hash) => {
                    if (err) throw err;
                    Applicant.pw = hash;
                    Applicant
                        .create({
                            f_name: req.body.f_name,
                            l_name: req.body.l_name,
                            contact_no: req.body.contact_no,
                            user_name: req.body.user_name,
                            email: req.body.email,
                            pw: hash
                        })
                        .then(() => {
                            Applicant.findOne({ where: { email: req.body.email } })
                                .then((user) => {
                                    if (!user) {
                                        emailerr = "Applicant signup not succesful!";
                                        return ResponseService.generalPayloadResponse(emailerr, null, res);
                                    }
                                    else {
                                        const payload = {
                                            id: user.id,
                                            f_name: user.f_name,
                                            l_name: user.l_name,
                                            contact_no: user.contact_no,
                                            user_name: user.user_name,
                                            email: user.email,
                                            pw: user.pw
                                        }; //create jwt payload
                                        console.log("awd")
                                        //sign token
                                        jwt.sign(
                                            payload,
                                            keys.secretOrKey,
                                            { expiresIn: 3600 },
                                            (err, token) => {
                                                if(err){
                                                    console.log(err,'error in getting token');
                                                }
                                                else{
                                                    console.log(token,'token');
                                                    ResponseService.generalPayloadResponse(null, {
                                                        applicant_id: user.id,
                                                        message: "Applicant registed successfully",
                                                        token:  token,
                                                    }, res)
                                                }
                                            }
                                        );
                                    }
                                })
                                .catch(err => ResponseService.generalPayloadResponse(err, null, res));
                        }).catch(err => ResponseService.generalPayloadResponse(err, null, res));
                });
            });

        }
    });
}

// Log in
exports.logIn = function (req, res) {
    console.log(req.body,'body ......................');
    const email = req.body.email;
    const pw = req.body.password;

    //find user by email
    Applicant.findOne({ where: { email } })
        .then((user) => {
           
            if (!user) {
                console.log('not found');
                emailerr = "User not found";
                ResponseService.generalPayloadResponse(emailerr, null, res);
            } else {
                console.log('user found.................');
                console.log(pw);
                console.log('compare');

                //check password
                bcrypt.compare(pw, user.pw).then((isMatch) => {
                    if (isMatch) {
                        console.log('matched');
                        //User matched
                        const payload = {
                            id: user.id,
                            f_name: user.f_name,
                            l_name: user.l_name,
                            contact_no: user.contact_no,
                            user_name: user.user_name,
                            email: user.email,
                            pw: user.pw
                        }; //create jwt payload
                        //sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err){
                                    console.log(err,'error in getting token');
                                }
                                else{
                                    console.log(token,'token');
                                    ResponseService.generalPayloadResponse(null, {
                                        applicant_id: user.id,
                                        message: "Applicant registed successfully",
                                        token:  token,
                                    }, res)
                                }
                            }
                        );
                    } else {
                        console.log('incorect pw');
                        passworerr = "Password incorrect";
                        return ResponseService.generalPayloadResponse(passworerr, null, res);
                    }
                })
                .catch(err=>{
                    console.log(err,'error');
                });
            }
        })
        .catch(err => {
            console.log(err,'error......................');
            ResponseService.generalPayloadResponse(err, null, res)
        });
}

//sample sending data
// {
//    "prevpassword": "hhhhhh"
//     "newpassword": "hhhhhh3",
//     "confirmpassword": "hhhhhh3"
// }
//reset password
exports.resetPassword = (req, res) => {
    const id = req.params.id;
    const prevpassword = req.body.prevpassword;
    const newpassword = req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;
    if (confirmpassword !== newpassword) {
        passerr = "Passwords must match!";
        return ResponseService.generalResponse(passerr, res);
    } else {
        Applicant.findOne({ where: { applicant_id: id } })
            .then(user => {
                if (!user) {
                    return ResponseService.generalResponse(msgs.couldNotFind, res);
                } else {
                    bcrypt.compare(prevpassword, user.pw, function (err, isMatch) {
                        if (err) {
                            return ResponseService.generalResponse(err, res);
                        } else if (!isMatch) {
                            return ResponseService.generalResponse("Password doesn't match!", res);
                        } else {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newpassword, salt, (err, hash) => {
                                    if (err) throw err;
                                    Applicant.pw = hash;
                                    Applicant.update(
                                        {
                                            pw: hash,
                                        },
                                        { where: { applicant_id: id } }
                                    ).then((user) => {
                                        if (!user) {
                                            err = "User not found";
                                            return ResponseService.generalResponse(err, res);
                                        }
                                        else {
                                            return ResponseService.generalResponse(null, res, status = 200, "password reset");
                                        }
                                    }).catch(err => ResponseService.generalPayloadResponse(err, null, res));
                                })
                            });
                        }
                    })
                }
            })
            .catch(err => ResponseService.generalPayloadResponse(err, null, res));
    }
}

// Update one by ID
exports.updateApplicatDetails = function (val, id, res) {

    if(val.pw !== undefined)delete val.pw;

    Applicant.update(val, { where: { id: id } })
    .then(rowsUpdated => {
        ResponseService.generalPayloadResponse(null, rowsUpdated, res);
    })
    .catch(err => ResponseService.generalPayloadResponse(err, null, res));
}
