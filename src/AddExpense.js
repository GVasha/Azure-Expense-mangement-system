import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [file_name, setFileName] = useState('');
  const [file_type, setFileType] = useState('');
  const [file_content, setFileContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);

      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result.split(',')[1]); // Extract Base64 content
      };
      reader.readAsDataURL(file); // Convert to Base64
    } else {
      // Reset file details if no file is selected
      setFileName('');
      setFileType('');
      setFileContent('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare expense data
    const expenseData = {
      amount: parseFloat(amount),
      category,
      date,
      description,
    };

    // Include file details only if a file is uploaded
    if (file_name && file_type && file_content) {
      expenseData.file_name = file_name;
      expenseData.file_type = file_type;
      expenseData.file_content = file_content;
    }

    try {
      const response = await axios.post(
        'https://http2mysqlfunc1ccb1.azurewebsites.net/api/AddExpense?code=nm0lODbQBwLfF43kjpE0sUsuUiEuDuR4WGkV4bSn9QEHAzFuMd5DQg%3D%3D',
        expenseData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.message || 'Expense added successfully!');
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      console.error('Error adding expense:', err);
    }
  };

  return (
    <div className="form-container">
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description of the expense"
          />
        </div>
        <div className="input-group">
          <label>Upload File (PNG or PDF - Optional):</label>
          <input
            type="file"
            accept=".png,.pdf"
            onChange={handleFileUpload}
          />
        </div>
        <button type="submit" className="submit-btn">Add Expense</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
};

export default AddExpense;
