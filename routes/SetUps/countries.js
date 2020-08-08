var express = require("express");
var countries = express();
var mysql = require("mysql");
var config = require("../../DB");
var Joi = require("joi");
var con = mysql.createPool(config);
countries.get("/", function (req, res) {
  con.getConnection(function (err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message,
      });
    } // not connected!
    else {
      let sp = "call getcountries()";
      connection.query(sp, function (error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message,
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
countries.get("/:ID", function (req, res) {
  const ID = req.params.ID;
  con.getConnection(function (err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message,
      });
    } // not connected!
    else {
      let sp = "call getOnecountry(?)";
      connection.query(sp, [ID], function (error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message,
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
countries.post("/", function (req, res) {
  const schema = Joi.object().keys({
    Description: Joi.string().min(3).required(),
    Code: Joi.string().min(1).required(),
    UserName: Joi.string().min(1).required(),
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    let data = [req.body.Code, req.body.Description, req.body.UserName];
    con.getConnection(function (err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message,
        });
      } // not connected!
      else {
        let sp = "call Savecountries(?,?,?)";
        connection.query(sp, data, function (error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message,
            });
          } else {
            res.json({
              success: true,
              message: "saved",
            });
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: result.error.details[0].message,
    });
  }
});
countries.put("/:ID", function (req, res) {
  const schema = Joi.object().keys({
    Description: Joi.string().min(3).required(),
    Code: Joi.string().min(1).required(),
    UserName: Joi.string().min(1).required(),
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    const ID = req.params.ID;
    let data = [ID, req.body.Description, req.body.UserName];

    con.getConnection(function (err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message,
        });
      } // not connected!
      else {
        let sp = "call Updatecountry(?,?,?)";
        connection.query(sp, data, function (error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message,
            });
          } else {
            res.json({
              success: true,
              message: "updated",
            });
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: result.error.details[0].message,
    });
  }
});
countries.delete("/:ID", function (req, res) {
  const ID = req.params.ID;

  let data = [ID, res.locals.user];
  con.getConnection(function (err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message,
      });
    } // not connected!
    else {
      let sp = "call Deletecountry(?,?)";
      connection.query(sp, data, function (error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message,
          });
        } else {
          res.json({
            success: true,
            message: "Deleted Successfully",
          });
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
module.exports = countries;
