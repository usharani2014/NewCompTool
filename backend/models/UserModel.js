import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

const users = {
  async findOneByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      return await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'department', 'position'],
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  async create({ name, email, password, department, position, verified }) {
    try {
      const newUser = await User.create({
        name,
        email,
        password,
        department,
        position,
        verified,
      });
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
};

export { User, users };
