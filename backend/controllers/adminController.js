import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/UserModel.js";
import Form from "../models/FormModel.js";

import generateAccessToken from "../utils/tokenGeneration.js";

const SendDataAdmin = asyncHandler(async (req, res) => {
  const {
    Nid,
    quarter,
    dataDescription,
    dataUnits,
    department,
    applicability,
    pitCumulative,
  } = req.body;

  // if (!['Q1', 'Q2', 'Q3', 'Q4'].includes(quarter)) {
  //   return res.status(400).json({ success: false, message: 'Invalid quarter specified' });
  // }

  try {
    let form;

    if (Nid) {
      form = await Form.findOne({ Nid });

      if (!form) {
        form = new Form({ Nid });
      }
    } else {
      form = new Form({ Nid, Quarter: {} });
    }

    form.Quarter = quarter || {};
    form.Data_Description = dataDescription;
    form.Data_Units = dataUnits;
    form.Department = department;
    form.Applicability = applicability;
    form.PIT_Cummulative = pitCumulative;

    await form.save();

    res.status(200).json({ success: true, message: "Data sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export {

  SendDataAdmin,
};
