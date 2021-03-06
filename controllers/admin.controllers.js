const clubMembers = require("../model/member.model");
const clubRequest = require("../model/clubreq.model");
const clubGenralUser = require("../model/accounts.model");

const { send } = require("../utils/mailer.utils");
const constants = require("../config/constants");

exports.getClubReq = async (req, res, next) => {
  try {
    let requests = await clubRequest
      .find()
      .select("email fullName teams imageUrl");
    return res.success(`Requests`, requests);
  } catch (err) {}
};

exports.acceptReq = async (req, res, next) => {
  try {
    const deleteUser = await clubRequest.findOneAndDelete({
      _id: req.query.id,
    });
    member = new clubMembers({
      fullName: deleteUser.fullName,
      email: deleteUser.email,
      mobileNumber: deleteUser.mobileNumber,
      password: deleteUser.password,
      imageUrl: deleteUser.imageUrl,
      gender: deleteUser.gender,
      teams: deleteUser.teams,
      college: deleteUser.college,
      message: deleteUser.message,
      role: "Member",
      googlePassword: deleteUser.googlePassword,
      branch: deleteUser.branch,
      year: deleteUser.year,
    });
    send(
      deleteUser.email,
      "Unnat Technical Club Request",
      constants.selectionMAil(deleteUser.fullName)
    );
    await member.save();
    const user = await await clubGenralUser.findOneAndDelete({
      email: deleteUser.email,
    });
    return res.success("Request Accepted");
  } catch (err) {}
};

exports.rejectReq = async (req, res, next) => {
  try {
    const deleteRequest = await clubRequest
      .findOneAndDelete({ _id: req.query.id })
      .select("email fullName mobileNumber teams");
    send(
      deleteRequest.email,
      "Unnat Technical Club Request",
      constants.rejectctionMAil(deleteRequest.fullName)
    );
    return res.success("Request Rejected", deleteRequest);
  } catch (err) {}
};

exports.removeMember = async (req, res, next) => {
    try {
      const deleteRequest = await clubMembers
        .findOneAndDelete({ _id: req.query.id })
        .select("email fullName mobileNumber teams");
      send(
        deleteRequest.email,
        "Unnat Technical Club",
        constants.removeMemberMAil(deleteRequest.fullName)
      );
      return res.success("Member Remove successfully", deleteRequest);
    } catch (err) {}
  };
