const { User, Company } = require('../models');

exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, companyName, description } = req.body;

    const user = await User.create({ name, email, password, role: 'company' });

    await Company.create({
      user_id: user.id,
      company_name: companyName,
      description,
      is_verified: false
    });

    res.status(201).json({ message: 'Company registration submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingCompanies = async (req, res) => {
  const companies = await Company.findAll({ where: { is_verified: false }, include: 'User' });
  res.json(companies);
};

exports.verifyCompany = async (req, res) => {
  const { id } = req.params;
  await Company.update({ is_verified: true }, { where: { id } });
  res.json({ message: 'Company verified' });
};
