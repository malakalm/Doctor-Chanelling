// models/user.mjs
import { DataTypes } from 'sequelize';
import sequelize from '../db.mjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'users', // matches your DB table name
  timestamps: false,  // disable createdAt, updatedAt
});

export default User;
