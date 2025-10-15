import React from 'react';
import { apiAddress } from './App';
import { Issue } from '../backend';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { IssueStatus } from './CreateIssueForm';

const deleteRowFromDb = async (issueId: string) => {
  const deleteOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  };
  await fetch(`${apiAddress}/issues/${issueId}`, deleteOptions);
}

export const IssueTable = (props: { issues: Issue[], setIssues: React.Dispatch<React.SetStateAction<Issue[]>> }) => {
  const handleRowDeletion = async (issueIdToDelete: string) => {
    await deleteRowFromDb(issueIdToDelete);
    // TODO: Have this refresh the issues
    props.setIssues(props.issues.filter((issue) => issue.id !== issueIdToDelete));
  }
  const issuesAsTableRows = props.issues.map((issue) => 
    <tr>
      <td>{issue.title}</td>
      <td>{IssueStatus[issue.status]}</td>
      <td>{issue.assigneeEmail}</td>
      <td>{issue.description}</td>
      <td><Button onClick={async () => await handleRowDeletion(issue.id)}>Delete</Button></td>
    </tr>
  );
  return (
    <Table size="sm" striped bordered hover>
      <thead>
        <tr>
          <td>Title</td>
          <td>Status</td>
          <td>Assignee</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        {issuesAsTableRows}
      </tbody>
    </Table>
  )
}