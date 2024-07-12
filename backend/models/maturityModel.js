import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Adjust the path if necessary

const Maturity = sequelize.define('Maturity', {
    id: {  // Optional primary key for better data management
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Particulars: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Score: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    Weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    Weighted_Score: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    Weighted_Score_Percentage: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    Target_Score: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    Target_Percentage: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
    },
    Remarks: {
        type: DataTypes.TEXT,
        defaultValue: '', 
    },
}, {
    timestamps: true,
    tableName: 'maturity', 
});

// Sync model with database (if you're creating the table)
// (async () => {
//   await Maturity.sync({ force: true }); // Be cautious with force: true in production!
// })();

export default Maturity;
