import React, { useState } from 'react';
import { apiAddress } from './App';
import { Issue } from '../backend';
import { IssueTable } from './IssueTable';

export const ViewAllIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const fetchAllIssues = async () => {
    try {
      const response = await fetch(
        `${apiAddress}/issues/`,
      );
      const apiResponse = await response.json();

      if (!response) {
        console.error("API returned no data for some reason");
      } else {
        setIssues(apiResponse);
      }
    } catch (error) {
      console.error(`API request failed! : ${error}`);
    }
  }

  return (
    <>
      <button onClick={fetchAllIssues}>Get All Issues</button>
      <IssueTable issues={issues} setIssues={setIssues}/>
    </>
  )
};