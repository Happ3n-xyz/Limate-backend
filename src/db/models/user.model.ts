import { Model, DataTypes, Sequelize } from 'sequelize';

const USERS_TABLE = 'users';

interface UserAttributes {
  id: string;
  username: string;
  profilePicture?: string;
  about?: string;
  badge?: string;
  isActive: boolean;
  address?: string;
  nonce?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    field: 'profile_picture',
  },
  badge: {
    type: DataTypes.STRING,
  },
  about: {
    type: DataTypes.STRING(180),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  nonce: {
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
};

class User extends Model<UserAttributes> {

  public id!: string;
  public username!: string;
  public profilePicture?: string;
  public about?: string;
  public badge?: string;
  public isActive!: boolean;
  public address?: string;
  public nonce?: string;
  public role!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    this.hasMany(models.Limate, { foreignKey: 'userId', as: 'limates' });
    this.hasOne(models.Code, { foreignKey: 'userId', as: 'code' });
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'User',
      timestamps: true,
    };
  }
}

export { USERS_TABLE, UserSchema, User, UserAttributes };
