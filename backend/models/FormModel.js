import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { User } from './UserModel.js';

const Form = sequelize.define('Form', {
  product: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  process: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  subProcess: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  circular_reference: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  regulator: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sectionReference: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  regulatoryExtract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  applicability: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  policySopReference: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  policySopExtract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  levelOfDocumentation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  establishedKey: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  periodicity: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  typesOfControl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  documentationOfControl: {
    type: DataTypes.INTEGER,
  },
  levelOfAutomationOfControl: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  responsibleUnit: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responsibleOwners: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email',
    },
  },
  reAllocatedResponsibleOwner: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'email',
    },
  },
  testStep: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  testEvidence: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  compliance: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  complianceScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  finalRiskScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mapStatus: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mapCompletionDeadline: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  zone: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  office: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  complianceOfficer: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email',
    },
  },
  reAllocatedComplianceOfficer: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'email',
    },
  },
  dataPointDefinition: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  complianceLineState: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    defaultValue: 'Pending',
  },
  complianceCheckRemarks: {
    type: DataTypes.TEXT,
  },
  CheckerCheckedState: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});



Form.belongsTo(User, { foreignKey: 'responsibleOwners', targetKey: 'email', as: 'ResponsibleOwners' });
Form.belongsTo(User, { foreignKey: 'reAllocatedResponsibleOwner', targetKey: 'email', as: 'ReAllocatedResponsibleOwner' });
Form.belongsTo(User, { foreignKey: 'complianceOfficer', targetKey: 'email', as: 'ComplianceOfficer' });
Form.belongsTo(User, { foreignKey: 'reAllocatedComplianceOfficer', targetKey: 'email', as: 'ReAllocatedComplianceOfficer' });


export default Form;
