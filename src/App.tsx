import React from 'react';
import './App.css';
import { CreateIssueForm } from './CreateIssueForm';
import { ViewAllIssues } from './ViewAllIssues';
import { ViewIssuesForUser } from './ViewIssuesForUser';

export const apiAddress = 'http://localhost:8080';

function App() {
  return (
    <div className="App">
      <div>Configured users are: a@user.com, b@user.com, c@user.com</div>
      <CreateIssueForm />
      <ViewAllIssues />
      <ViewIssuesForUser />
    </div>
  );
}

export default App;
