import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import ExpensePieChart from './ExpensePieChart';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/Add-expense">Add Expense</Link>
            </li>
            <li>
              <Link to="/">View Expenses</Link>
            </li>
            <li>
              <Link to="/pie">View pie chart</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/Add-expense" element={<AddExpense />} />
          <Route path="/" element={<ExpenseList />} />
          <Route path="/pie" element={<ExpensePieChart />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
