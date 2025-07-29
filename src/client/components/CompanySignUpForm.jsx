import { useState } from 'react';
import { registerCompany } from '../../services/companyServices';

export default function CompanySignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', companyName: '', description: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await registerCompany(form);
    alert('Submitted for review!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <input name="companyName" onChange={handleChange} placeholder="Company Name" />
      <textarea name="description" onChange={handleChange} placeholder="Description" />
      <button type="submit">Submit</button>
    </form>
  );
}
