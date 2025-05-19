
import { Sequelize } from 'sequelize';

let sequelize;

const getDBConnection = () => {
  if (!sequelize) {
    sequelize = new Sequelize('docbc', 'dev', '1234', {
      host: '173.225.102.212',
      dialect: 'mysql',
      logging: false,
    });
  }
  return sequelize;
};

export default getDBConnection;