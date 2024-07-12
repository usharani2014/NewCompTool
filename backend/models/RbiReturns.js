import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Assuming your database configuration is here

const RbiReturn = sequelize.define('RbiReturn', {
  // Assuming you have an auto-incrementing ID field as the primary key (optional)
  //id: { 
  //  type: DataTypes.INTEGER,
  //  autoIncrement: true,
  //  primaryKey: true
  //},
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, // TEXT for potentially longer descriptions
    allowNull: false,
  },
  frequency: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  concerned_department: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  reporting_entity: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  circulars: {
    type: DataTypes.TEXT, // TEXT for potentially longer circular details
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATE,
  },
  filling_date: {
    type: DataTypes.DATE,
  },
  delay: {
    type: DataTypes.INTEGER, // Assuming whole number days for delay
  },
  filed_delay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to not filed with delay
  },
  approval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default to not approved
  },
  remarks: {
    type: DataTypes.TEXT, // TEXT for potentially longer remarks
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  tableName: 'rbi_returns', // Custom table name (adjust as needed)
});

// Sync model with the database (only needed initially)

export default RbiReturn;
