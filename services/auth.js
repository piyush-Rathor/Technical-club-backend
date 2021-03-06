const jwt = require("jsonwebtoken");
const constants = require("../config/constants");

const genralUser = require("../model/accounts.model");

const memberUser = require("../model/member.model");

const adminUser = require("../model/admin.module");

exports.verify = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      console.log(`verify token found`);
      jwt.verify(token, constants.JWT_SECRET, async function (err, decoded) {
        if (err) {
          console.log(`Inside Error${token}`);
          return res.unauthorizedUser();
        } else {
          req.decoded = decoded;
          let user = await genralUser.findOne({ email: decoded.email });
          console.log(
            `User found : ${user.fullName}. [${user._id}] role: ${user.role} Auth success`
          );
          res.locals.role = user.role;
          res.locals.user = user;
          console.log("next");
          return await next();
        }
      });
    } else {
      console.log("Access Token missing");
      return res.unauthorizedUser();
    }
  } catch (e) {
    if (/invalid token/i.test(e)) return res.unauthorizedUser();
    return res.error(e);
  }
};

exports.verifyMemberorAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      console.log(`verify token found`);
      jwt.verify(token, constants.JWT_SECRET, async function (err, decoded) {
        if (err) {
          console.log(`Inside Error${token}`);
          return res.unauthorizedUser();
        } else {
          req.decoded = decoded;
          let user = await memberUser.findOne({ email: decoded.email });
          if (!user) {
            user = await adminUser.findOne({ email: decoded.email });
          }
          if (!user) {
            return res.unauthorizedUser("The User does not authorized for this router")
          }
          console.log(
            `User found : ${user.fullName}. [${user._id}] role: ${user.role} Auth success`
          );
          res.locals.role = user.role;
          res.locals.user = user;
          console.log("next");
          return await next();
        }
      });
    } else {
      console.log("Access Token missing");
      return res.unauthorizedUser();
    }
  } catch (e) {
    if (/invalid token/i.test(e)) return res.unauthorizedUser();
    return res.error(e);
  }
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      console.log(`verify token found`);
      jwt.verify(token, constants.JWT_SECRET, async function (err, decoded) {
        if (err) {
          console.log(`Inside Error${token}`);
          return res.unauthorizedUser();
        } else {
          req.decoded = decoded;
          const user = await adminUser.findOne({ email: decoded.email });
          if (!user) {
            return res.unauthorizedUser("The User does not authorized for this router")
          }
          console.log(
            `User found : ${user.fullName}. [${user._id}] role: ${user.role} Auth success`
          );
          res.locals.role = user.role;
          res.locals.user = user;
          console.log("next");
          return await next();
        }
      });
    } else {
      console.log("Access Token missing");
      return res.unauthorizedUser();
    }
  } catch (e) {
    if (/invalid token/i.test(e)) return res.unauthorizedUser();
    return res.error(e);
  }
};
