import { Model, DataTypes, Sequelize } from 'sequelize';
import { USERS_TABLE } from './user.model';

const LIMATES_TABLE = 'limates';

interface LimateAttributes {
    id: string;
    username: string;
    profilePicture?: string;
    badge?: string;
    about?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const LimateSchema = {
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
    about: {
        type: DataTypes.STRING(180),
    },
    badge: {
        type: DataTypes.STRING,
    },
    userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.UUID,
        references: {
        model: USERS_TABLE,
        key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

class Limate extends Model<LimateAttributes> {

    public id!: string;
    public username!: string;
    public profilePicture?: string;
    public about?: string;
    public badge?: string;
    public userId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    static associate(models: any) {
        this.belongsTo(models.User, { as: 'user' });
    }

    static config(sequelize: Sequelize) {
        return {
        sequelize,
        tableName: LIMATES_TABLE,
        modelName: 'Limate',
        timestamps: true,
        };
    }
}

export { LIMATES_TABLE, LimateSchema, Limate, LimateAttributes };
