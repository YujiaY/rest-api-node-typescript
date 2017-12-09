"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (sequelize, dataTypes) {
    var User = sequelize.define("User", {
        firstname: dataTypes.STRING,
        lastname: dataTypes.STRING,
        bio: dataTypes.TEXT,
        email: {
            type: dataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: dataTypes.STRING,
        createdAt: {
            type: dataTypes.DATE,
            field: 'created_at',
            defaultValue: dataTypes.NOW
        },
        updatedAt: {
            type: dataTypes.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: dataTypes.DATE,
            field: 'deleted_at'
        }
    }, {
        tableName: 'users',
        indexes: [],
        classMethods: {
            associate: function (models) {
                User.belongsToMany(models.Role, {
                    through: 'user_role',
                    foreignKey: 'user_id',
                    as: 'roles'
                });
                User.hasMany(models.ResetPasswordToken, {
                    foreignKey: 'user_id',
                    as: 'tokens'
                });
                User.hasMany(models.Post, {
                    foreignKey: 'post_id',
                    as: 'posts'
                });
            }
        }
    });
    return User;
};
//# sourceMappingURL=user.js.map