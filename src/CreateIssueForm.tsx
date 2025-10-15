import React from 'react';
import { useState } from 'react';
import { apiAddress } from './App';
// TODO: import from backend
export enum IssueStatus {OPEN, IN_PROGRESS, RESOLVED, CLOSED}

export const CreateIssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [status, setStatus] = useState(IssueStatus.OPEN);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleAssigneeEmailChange = (e) => {
    setAssigneeEmail(e.target.value);
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  }
  // TODO: HAVE THIS REFRESH THE ISSUES
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${apiAddress}/issues/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            description,
            assigneeEmail,
            status
        }),
    });
  }

  return (
    <form>
      <label>Title
        <input
          type="text" 
          value={title}
          onChange={handleTitleChange}
        />
      </label>
      <label>Description
        <input
          type="text" 
          value={description}
          onChange={handleDescriptionChange}
        />
      </label>
      <label>Status
        <select onChange={handleStatusChange} name="status">
            <option value={IssueStatus.OPEN}>OPEN</option>
            <option value={IssueStatus.IN_PROGRESS}>IN PROGRESS</option>
            <option value={IssueStatus.CLOSED}>CLOSED</option>
            <option value={IssueStatus.RESOLVED}>RESOLVED</option>
        </select>
      </label>
      <label>AssigneeEmail
        <input
          type="text" 
          value={assigneeEmail}
          onChange={handleAssigneeEmailChange}
        />
      </label>
      <button onClick={handleSubmit}>Create Issue</button>
    </form>
  )
}