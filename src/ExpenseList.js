import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpenseList.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(9);
  const [editingExpenseId, setEditingExpenseId] = useState(null); // Track ID of editing expense
  const [editedExpense, setEditedExpense] = useState({}); // Store edited expense details
  const [balance, setBalance] = useState(0); // Start with a balance of $10,000

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          'https://http2mysqlfunc1ccb1.azurewebsites.net/api/GetAllExpenses?code=Tms3OUFDbEszQR9cjF6iGEwe2MKUTwg91QQK-y_CS78rAzFuws22eQ%3D%3D'
        );
        setExpenses(response.data);
        const initialBalance = response.data.reduce((acc, expense) => acc +expense.Amount, 0);
        setBalance(initialBalance);
      } catch (err) {
        setError('Error fetching expenses. Please try again later.');
      }
    };

    fetchExpenses();
  }, []);

  // Handle edit start
  const handleEditStart = (expense) => {
    setEditingExpenseId(expense.ExpenseID);
    setEditedExpense({ ...expense });
  };

  // Handle expense update
  const handleUpdateExpense = async () => {
    if (
      !editedExpense.ExpenseID ||
      !editedExpense.Amount ||
      !editedExpense.Category ||
      !editedExpense.Date ||
      !editedExpense.Description
    ) {
      setError('Please fill out all fields before saving.');
      return;
    }

    try {
      const response = await axios.post(
        'https://http2mysqlfunc1ccb1.azurewebsites.net/api/UpdateExpense?code=GCjkQT17aiCGs0YErmQZKfxcXQB1MYLZwRO_ozkraMfIAzFur53-yA%3D%3D',
        {
          id: editedExpense.ExpenseID,
          amount: editedExpense.Amount,
          category: editedExpense.Category,
          date: editedExpense.Date,
          description: editedExpense.Description,
          file_name: editedExpense.file_name || '',
          file_type: editedExpense.file_type || '',
          file_content: editedExpense.file_content || '',
          download_receipt: editedExpense.DownloadReceipt || '', // Add the updated link
        }
      );

      if (response.status === 200) {
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense.ExpenseID === editedExpense.ExpenseID
              ? { ...expense, ...editedExpense }
              : expense
          )
        );

        const originalExpense = expenses.find(
          (expense) => expense.ExpenseID === editedExpense.ExpenseID
        );
        setBalance((prevBalance) =>
          prevBalance + (originalExpense.Amount - editedExpense.Amount)
        );

        setEditingExpenseId(null);
        setEditedExpense({});
      } else {
        setError('Error updating the expense. Please try again.');
      }
    } catch (err) {
      setError('Error updating the expense. Please try again later.');
    }
  };

  // Handle edit cancel
  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setEditedExpense({});
  };

  // Handle delete
  const handleDelete = async (expenseId) => {
    try {
      const expenseToDelete = expenses.find((expense) => expense.ExpenseID === expenseId);
      const response = await axios.post(
        'https://http2mysqlfunc1ccb1.azurewebsites.net/api/DeleteExpense?code=t_qQtPadNiSiJF0JiGl1vj6svynln2GqZF0FQZcrKe2dAzFuarmKWg%3D%3D',
        { id: expenseId }
      );

      if (response.status === 200) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.ExpenseID !== expenseId)
        );
        setBalance((prevBalance) => prevBalance + expenseToDelete.Amount);
      } else {
        setError('Error deleting the expense. Please try again later.');
      }
    } catch (err) {
      setError('Error deleting the expense. Please try again later.');
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.Category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="expense-list-container">
      <div className="header">
        <div className="balance">
          <h2>Total Spent: {balance.toFixed(1)}€</h2>
        </div>
        <input
          type="text"
          placeholder="Search by category or description"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="card-container">
        {currentExpenses.map((expense) => (
          <div className="expense-card" key={expense.ExpenseID}>
            {editingExpenseId === expense.ExpenseID ? (
              <div className="edit-mode">
                <label>
                  <strong>Category:</strong>
                  <input
                    type="text"
                    value={editedExpense.Category}
                    onChange={(e) =>
                      setEditedExpense({ ...editedExpense, Category: e.target.value })
                    }
                  />
                </label>
                <label>
                  <strong>Amount:</strong>
                  <input
                    type="number"
                    value={editedExpense.Amount}
                    onChange={(e) =>
                      setEditedExpense({ ...editedExpense, Amount: parseFloat(e.target.value) })
                    }
                  />
                </label>
                <label>
                  <strong>Date:</strong>
                  <input
                    type="date"
                    value={editedExpense.Date}
                    onChange={(e) =>
                      setEditedExpense({ ...editedExpense, Date: e.target.value })
                    }
                  />
                </label>
                <label>
                  <strong>Description:</strong>
                  <input
                    type="text"
                    value={editedExpense.Description}
                    onChange={(e) =>
                      setEditedExpense({ ...editedExpense, Description: e.target.value })
                    }
                  />
                </label>
                <label>
                  <strong>Upload Receipt (PNG or PDF):</strong>
                  <input
                    type="file"
                    accept=".png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setEditedExpense({
                            ...editedExpense,
                            file_name: file.name,
                            file_type: file.type,
                            file_content: reader.result.split(',')[1], // Base64 content
                            DownloadReceipt: URL.createObjectURL(file), // Create a URL for the file
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <label>
                  <strong>Link (optional):</strong>
                  <input
                    type="text"
                    value={editedExpense.DownloadReceipt || ''}
                    onChange={(e) =>
                      setEditedExpense({ ...editedExpense, DownloadReceipt: e.target.value })
                    }
                  />
                </label>
                <div className="edit-buttons">
                  <button className="save-btn" onClick={handleUpdateExpense}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="expense-title">{expense.Category}</h3>
                <p>
                  <strong>Amount:</strong> ${expense.Amount.toFixed(2)}
                </p>
                <p>
                  <strong>Date:</strong> {expense.Date}
                </p>
                <p>
                  <strong>Description:</strong> {expense.Description}
                </p>
                {expense.DownloadReceipt && (
                  <p>
                    <strong>Receipt:</strong>{' '}
                    <a href={expense.DownloadReceipt} target="_blank" rel="noopener noreferrer">
                      View Receipt
                    </a>
                  </p>
                )}
                <div className="card-buttons">
                  <button className="edit-btn" onClick={() => handleEditStart(expense)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense.ExpenseID)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {expenses.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
