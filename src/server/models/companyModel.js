module.exports = (sequelize, DataTypes) => {
  // Define the Company model with its fields and constraints
  const Company = sequelize.define("Company", {
    // Foreign key - links each company to a user (company owner)
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    // Name of the company (required)
    company_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    // Short description of the company (optional)
    description: { 
      type: DataTypes.TEXT 
    },

    // Verification status (default = false, set true after admin approval)
    is_verified: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
  });

  // Define associations (relations with other models)
  Company.associate = (models) => {
    // Each company belongs to one user
    Company.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Company;
};
