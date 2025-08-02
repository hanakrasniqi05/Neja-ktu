module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Company;
};
