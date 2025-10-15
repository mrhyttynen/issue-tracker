import React, { useState } from "react";
import { Issue } from "../backend";
import { apiAddress } from "./App";
import { IssueTable } from "./IssueTable";

export const ViewIssuesForUser = () => {
  const [issuesForUser, setIssuesForUser] = useState<Issue[]>([]);
  
  const [userEmail, setUserEmail] = useState("");
  const handleUserEmailChange = (e) => {
    setUserEmail(e.target.value);
  }

  const fetchIssuesForUser = async (e) => {
    try {
      e.preventDefault();
      console.log(`sending GET request to ${apiAddress}/issues/${userEmail}`)
      const response = await fetch(
        `${apiAddress}/issues/${userEmail}`,
      );
      const apiResponse = await response.json();

      if (!response) {
        console.error("API returned no data for some reason");
      } else {
        setIssuesForUser(apiResponse);
      }
    } catch (error) {
      console.error(`API request failed! : ${error}`);
    }
  }

  return (
    <>
    <form>
      <label>UserEmail
        <input
          type="text" 
          value={userEmail}
          onChange={handleUserEmailChange}
        />
      </label>
      <button onClick={fetchIssuesForUser}>Get Issues for User</button>
    </form>
    <IssueTable issues={issuesForUser} setIssues={setIssuesForUser}/>
    </>
  )
};
