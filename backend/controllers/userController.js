import asyncHandler from "express-async-handler";
import {User} from "../models/UserModel.js";
import Form from "../models/FormModel.js";
import Maturity from "../models/maturityModel.js";
import RbiReturn from "../models/RbiReturns.js";
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js'; 

const uploadFormData = asyncHandler(async (req, res) => {
  try {
    const dataArray = req.body;
    if (!Array.isArray(dataArray)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expecting an array of objects.",
      });
    }

    for (const dataItem of dataArray) {
      const {
        product,
        process,
        subProcess,
        circular_reference,
        year,
        regulator,
        sectionReference,
        regulatoryExtract,
        applicability,
        policySopReference,
        policySopExtract,
        levelOfDocumentation,
        establishedKey,
        periodicity,
        typesOfControl,
        documentationOfControl,
        levelOfAutomationOfControl,
        totalScore,
        responsibleUnit,
        responsibleOwners,
        reAllocatedResponsibleOwner,
        testStep,
        testEvidence,
        compliance,
        complianceScore,
        finalRiskScore,
        mapStatus,
        mapCompletionDeadline,
        zone,
        office,
        complianceOfficer,
        reAllocatedComplianceOfficer,
        dataPointDefinition,
      } = dataItem;

      let form = await Form.findOne({
        where: {
          [Op.and]: [
            { product },
            { process },
            { circular_reference },
            { regulatoryExtract },
          ],
        },
      });

      if (!form) {
        const newForm = await Form.create({
          product,
          process,
          subProcess,
          circular_reference,
          year,
          regulator,
          sectionReference,
          regulatoryExtract,
          applicability,
          policySopReference,
          policySopExtract,
          levelOfDocumentation,
          establishedKey,
          periodicity,
          typesOfControl,
          documentationOfControl,
          levelOfAutomationOfControl,
          totalScore,
          responsibleUnit,
          responsibleOwners,
          reAllocatedResponsibleOwner,
          testStep,
          testEvidence,
          compliance,
          complianceScore,
          finalRiskScore,
          mapStatus,
          mapCompletionDeadline,
          zone,
          office,
          complianceOfficer,
          reAllocatedComplianceOfficer,
          dataPointDefinition,
          CheckerCheckedState: false,
        });
      } else {
        await form.update({
          product,
          process,
          subProcess,
          circular_reference,
          year,
          regulator,
          sectionReference,
          regulatoryExtract,
          applicability,
          policySopReference,
          policySopExtract,
          levelOfDocumentation,
          establishedKey,
          periodicity,
          typesOfControl,
          documentationOfControl,
          levelOfAutomationOfControl,
          totalScore,
          responsibleUnit,
          responsibleOwners: req.user.id,
          reAllocatedResponsibleOwner,
          testStep,
          testEvidence,
          compliance,
          complianceScore,
          finalRiskScore,
          mapStatus,
          mapCompletionDeadline,
          zone,
          office,
          complianceOfficer,
          reAllocatedComplianceOfficer,
          dataPointDefinition,
          CheckerCheckedState: false,
        });
      }
    }
    res.status(201).json({ success: true, message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `${error}` });
  }
});

const getFormData = asyncHandler(async (req, res) => {
  const Form_Data = await Form.findAll();
  if (!Form_Data) {
    return res.status(404).json({ success: false, error: "No Data To Display" });
  }
  return res.status(200).json({ success: true, Data: Form_Data });
});

const getCheckerFormData = asyncHandler(async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log(userEmail)
    const formData = await Form.findAll({
      where: {
        [Op.or]: [
          { complianceOfficer: userEmail },
          { reAllocatedComplianceOfficer: userEmail }
        ]
      },
      include: [
        { model: User, as: 'ReAllocatedComplianceOfficer', attributes: ['name', 'email'] },
        { model: User, as: 'ComplianceOfficer', attributes: ['name', 'email'] }

      ]
    });
    console.log(formData.length)
    
    if (!formData || formData.length === 0) {
      return res.status(404).json({ success: true, message: "No data for this user (checker)" });
    }
    return res.status(200).json({ success: true, Data: formData });
  } catch (error) {
    console.error('Error retrieving checker form data:', error);
    return res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
});

const getMakerFormData = asyncHandler(async (req, res) => {
  try {
    console.log(req.user)
    const userEmail = req.user.email;
    const formData = await Form.findAll({
      where: {
        [Op.or]: [
          { responsibleOwners: userEmail },
          { reAllocatedResponsibleOwner: userEmail }
        ],
        complianceLineState: "Rejected"
      },
      include: [
        { model: User, as: 'ReAllocatedComplianceOfficer', attributes: ['name', 'email'] }
      ]
    });
    console.log(formData.length)

    if (!formData || formData.length === 0) {
      return res.status(404).json({ success: true, message: "No data for this user (maker)" });
    }
    console.log(formData.length)
    return res.status(200).json({ success: true, Data: formData });
  } catch (error) {
    console.error('Error retrieving maker form data:', error);
    return res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
});

const checkerCheckedData = asyncHandler(async (req, res) => {
  const { position, email } = req.user;

  if (position !== "Compliance Checker") {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  const dataObj = req.body;
  console.log(dataObj)

  if (!Array.isArray(dataObj)) {
    return res.status(400).json({ success: false, message: "Invalid data format" });
  }

  try {
    // Use a transaction to ensure all operations are completed successfully or rolled back
    await sequelize.transaction(async (t) => {
      for (const dataItem of dataObj) {
        console.log(dataItem)
        const { id, complianceLineState, complianceCheckRemarks } = dataItem;

        const form = await Form.findByPk(id, { transaction: t });
        console.log(form)

        if (!form || (form.complianceOfficer !== email && form.reAllocatedComplianceOfficer !== email)) {
          throw new Error("No form found or unauthorized access");
        }

        form.complianceLineState = complianceLineState;
        form.complianceCheckRemarks = complianceCheckRemarks;
        form.CheckerCheckedState = true;
        await form.save({ transaction: t });
      }
    });

    return res.status(201).json({ success: true, message: "Data sent successfully" });

  } catch (error) {
    console.error('Error processing checker data:', error);
    return res.status(500).json({ success: false, message: `${error.message}` });
  }
});

const deleteFormData = asyncHandler(async (req, res) => {
  const { position} = req.user;

  if (position !== "Compliance Admin Users" && position !== "Compliance Checker" && position !== "Compliance Maker") {
    return res.status(401).json({ success: false, error: "Unauthorized Access" });
  }

  const { id } = req.query;
  console.log(id)

  try {
    const form = await Form.findOne({ where: { id } });

    if (!form) {
      return res.status(404).json({ success: false, error: "No Data with given id" });
    }

    await form.destroy();
    return res.status(200).json({ success: true, message: "Data Deleted Successfully" });
  } catch (error) {
    console.error('Error deleting form data:', error);
    return res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
});


const powerBiAccessToken = asyncHandler(async (req, res) => {
  try {
    const { client_id, client_secret, tenant_id, grant_type } = req.body;

    const response = await axios.post(`https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`, {
      client_id,
      client_secret,
      grant_type,
      scope: 'https://graph.microsoft.com/.default', // Adjust scope based on your permissions
    });

    res.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const getMaturityData = asyncHandler(async (req, res) => {
  const { type } = req.query;

  try {
    const data = await Maturity.findAll({
      where: { type },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!data.length) {
      return res.status(404).json({ success: false, error: "No Data To Display" });
    }

    return res.status(200).json({ success: true, Data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



const uploadMaturityData = asyncHandler(async (req, res) => {
  try {
      const dataArray = req.body;

      if (!Array.isArray(dataArray)) {
          return res.status(400).json({
              success: false,
              message: "Invalid data format. Expecting an array of objects.",
          });
      }

      for (const dataItem of dataArray) {
          const {
              type,
              Particulars,
              Score,
              Weight,
              Weighted_Score,
              Weighted_Score_Percentage,
              Target_Score,
              Target_Percentage,
              Remarks
          } = dataItem;

          // Convert percentage strings to numbers
          dataItem.Weight = parseFloat(dataItem.Weight);
          dataItem.Weighted_Score = parseFloat(dataItem.Weighted_Score);
          dataItem.Target_Score = parseFloat(dataItem.Target_Score);
          dataItem.Score = parseFloat(dataItem.Score);

          dataItem.Weighted_Score_Percentage = parseFloat(dataItem.Weighted_Score_Percentage);
          dataItem.Target_Percentage = parseFloat(dataItem.Target_Percentage);

          let form = await Maturity.findOne({
              where: { type, Particulars }
          });

          if (!form) {
              await Maturity.create(dataItem); 
          } else {
              await form.update({
                  Score,
                  Weighted_Score,
                  Weighted_Score_Percentage, // Updated values
                  Remarks
              });
          }
      }

      res.status(201).json({ success: true, message: "Data sent successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: `${error}` });
  }
});


// Get Maturity Summary
const getMaturitySummary = asyncHandler(async (req, res) => {
  try {
    const types = ["COS", "CF", "PAP", "SAM", "TAS"];
    const maturityData = await Promise.all(types.map(type => Maturity.findAll({ where: { type } })));

    if (maturityData.some(data => !data.length)) {
      return res.status(404).json({ success: false, error: "No Data To Display" });
    }

    const calculateTotal = (data, type) => {
      let totalWeightedScore = 0;
      let totalTargetScore = 0;
      data.forEach((item) => {
        totalWeightedScore += parseFloat(item.Weighted_Score);
        totalTargetScore += parseFloat(item.Target_Score);
      });
      return { type, totalWeightedScore, totalTargetScore };
    };

    const summary = maturityData.map((data, index) => {
      const typeNames = ["Compliance Organisation Structure", "Compliance Framework", "Policy and procedures", "Skills and manpower", "Technology and systems"];
      return calculateTotal(data, typeNames[index]);
    });

    return res.status(200).json({ success: true, Data: summary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getAlertNotiData = asyncHandler(async (req, res) => {
  const data = await Form.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { complianceOfficer: req.user.email },
            { reAllocatedComplianceOfficer: req.user.email }
          ]
        },
        { compliance: 'Not Complied' }
      ]
    }
  });
  const count = data.length;
  const responsibleOwners = data[0].responsibleOwners;
  const sendData = { count, responsibleOwners }

  return res.status(200).json({ success: true, Data: sendData });
});

const uploadReturnsData = asyncHandler(async (req, res) => {
    try {
        const { 
            name, description, frequency, concerned_department,
            reporting_entity, circulars, due_date, filling_date,
            delay, filed_delay, approval, remarks 
        } = req.body;

        // Convert string booleans to actual booleans
        const parsedFiledDelay = filed_delay === "Yes";
        const parsedApproval = approval === "Yes";

        const todaysDate = new Date();

        // Find or create the RbiReturn entry
        const [rbiReturn, created] = await RbiReturn.findOrCreate({
            where: {
                [Op.and]: [
                    { name },
                    { description },
                    { frequency },
                    { concerned_department },
                    { reporting_entity },
                    { circulars },
                ]
            }, 
            defaults: {
                name, description, frequency, concerned_department,
                reporting_entity, circulars, due_date, filling_date: todaysDate,
                delay, filed_delay: parsedFiledDelay, approval: parsedApproval, remarks
            },
        });

        // Update if the entry already exists
        if (!created) {
            await rbiReturn.update({
                due_date, filling_date: todaysDate, delay,
                filed_delay: parsedFiledDelay, approval: parsedApproval, remarks
            });
        }

        res.status(201).json({ success: true, message: "RBI Return data uploaded successfully" }); 

    } catch (error) {
        console.error('Error uploading RBI return data:', error); 
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

const getReturnsData = asyncHandler(async (req, res) => {
    const returns = await RbiReturn.findAll(); 
    if (!returns || returns.length === 0) {
        return res.status(404).json({ 
            success: false, 
            message: "No RBI returns found" 
        });
    }

    res.status(200).json({ success: true, data: returns });
});


const getDepartmentUser = asyncHandler(async (req,res) => {
  const user = req.user;
  try {
    const users = await User.findAll({
      where: { department: user.department },
      attributes: ['email', 'name'],
    });

    if (users) {
      return res.status(200).json({ success: true, Data: users });
    } else {
      return res.status(400).json({ success: false, error: 'No users found' });
    }
  } catch (error) {
    console.error('Error finding users by department:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

const makerUploadFormData = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const dataArray = req.body;
    console.log(dataArray);
    console.log("----------------------------------------------------------------");
    
    for (let key in dataArray) {
      const { ...updateFields } = dataArray[key];
      console.log(updateFields);

      let form = await Form.findByPk(key, { transaction });

      if (!form) {
        await transaction.rollback();
        return res.status(400).json({ success: false, error: "No returns to display" });
      } else {
        for (let field in updateFields) {
          form[field] = updateFields[field];
        }
        console.log(form);
        form.responsibleOwners = req.user.email;
        form.CheckerCheckedState = false;
        form.complianceLineState = "Pending";
        await form.save({ transaction });
      }
    }

    await transaction.commit();
    res.status(201).json({ success: true, message: "Data sent successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: `${error}` });
  }
});


const uploadExistingFormData = asyncHandler(async (req, res) => {
  try {
    const dataArray = req.body;
    if (!Array.isArray(dataArray)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expecting an array of objects.",
      });
    }

    for (const dataItem of dataArray) {
      const {
        product,
        process,
        subProcess,
        circular_reference,
        year,
        regulator,
        sectionReference,
        regulatoryExtract,
        applicability,
        policySopReference,
        policySopExtract,
        levelOfDocumentation,
        establishedKey,
        periodicity,
        typesOfControl,
        documentationOfControl,
        levelOfAutomationOfControl,
        totalScore,
        responsibleUnit,
        responsibleOwners,
        reAllocatedResponsibleOwner,
        testStep,
        testEvidence,
        compliance,
        complianceScore,
        finalRiskScore,
        mapStatus,
        mapCompletionDeadline,
        zone,
        office,
        complianceOfficer,
        reAllocatedComplianceOfficer,
        dataPointDefinition,
      } = dataItem;
      console.log(dataItem)
      let form = await Form.findOne({
        where: {
          [Op.and]: [
            { product },
            { process },
            { circular_reference },
            { regulatoryExtract },
          ],
        },
      });

      if (!form) {
        const newForm = await Form.create({
          product,
          process,
          subProcess,
          circular_reference,
          year,
          regulator,
          sectionReference,
          regulatoryExtract,
          applicability,
          policySopReference,
          policySopExtract,
          levelOfDocumentation,
          establishedKey,
          periodicity,
          typesOfControl,
          documentationOfControl,
          levelOfAutomationOfControl,
          totalScore,
          responsibleUnit,
          responsibleOwners: req.user.email,
          reAllocatedResponsibleOwner,
          testStep,
          testEvidence,
          compliance,
          complianceScore,
          finalRiskScore,
          mapStatus,
          mapCompletionDeadline,
          zone,
          office,
          complianceOfficer,
          reAllocatedComplianceOfficer,
          dataPointDefinition,
          CheckerCheckedState: false,
        });
      } else {
        await form.update({
          product,
          process,
          subProcess,
          circular_reference,
          year,
          regulator,
          sectionReference,
          regulatoryExtract,
          applicability,
          policySopReference,
          policySopExtract,
          levelOfDocumentation,
          establishedKey,
          periodicity,
          typesOfControl,
          documentationOfControl,
          levelOfAutomationOfControl,
          totalScore,
          responsibleUnit,
          responsibleOwners: req.user.email,
          reAllocatedResponsibleOwner,
          testStep,
          testEvidence,
          compliance,
          complianceScore,
          finalRiskScore,
          mapStatus,
          mapCompletionDeadline,
          zone,
          office,
          complianceOfficer,
          reAllocatedComplianceOfficer,
          dataPointDefinition,
          CheckerCheckedState: false,
        });
      }
    }
    res.status(201).json({ success: true, message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `${error}` });
  }
});

export {
  getFormData,
  uploadFormData,
  deleteFormData,
  powerBiAccessToken,
  getMaturityData,
  uploadMaturityData,
  getMaturitySummary,
  getAlertNotiData,
  uploadReturnsData,
  getReturnsData,
  getCheckerFormData,
  checkerCheckedData,
  getMakerFormData,
  makerUploadFormData,
  uploadExistingFormData,
  getDepartmentUser
};
