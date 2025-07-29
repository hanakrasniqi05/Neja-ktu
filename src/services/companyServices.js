import { companyAPI } from './api';

export const registerCompany = async (formData) => {
  return companyAPI.registerCompany(formData);
};

export const fetchPendingCompanies = async () => {
  return companyAPI.getPendingCompanies();
};

export const verifyCompany = async (id) => {
  return companyAPI.verifyCompany(id);
};