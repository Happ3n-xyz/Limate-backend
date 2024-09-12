import { Sequelize } from 'sequelize';
import { User, UserSchema } from './user.model';
import { Limate, LimateSchema } from './limate.model';
import { Code, CodeSchema } from './code.model';

function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Limate.init(LimateSchema, Limate.config(sequelize));
  Code.init(CodeSchema, Code.config(sequelize));

  User.associate(sequelize.models);
  Limate.associate(sequelize.models);
  Code.associate(sequelize.models);
}

export default setupModels;
