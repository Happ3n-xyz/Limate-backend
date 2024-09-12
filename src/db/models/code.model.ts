import { Model, DataTypes, Sequelize } from 'sequelize';
import { USERS_TABLE } from './user.model';

const CODES_TABLE = 'codes';

interface CodeAttributes {
    id: string;
    code: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const CodeSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    code: {
        allowNull: false,
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

class Code extends Model<CodeAttributes> {

    public id!: string;
    public code!: string;
    public userId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    static associate(models: any) {
        this.belongsTo(models.User, { as: 'user' });
    }

    static config(sequelize: Sequelize) {
        return {
        sequelize,
        tableName: CODES_TABLE,
        modelName: 'Code',
        timestamps: true,
        };
    }
}

export { CODES_TABLE, CodeSchema, Code, CodeAttributes };
