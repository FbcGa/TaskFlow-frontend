import React from "react";

const Dark = ({ children }) => (
  <span className="bg-dark text-white px-1 rounded">{children}</span>
);
export const BackendURL = () => (
  <div className="mt-5 pt-5 w-50 mx-auto">
    <h2>Missing  env variable</h2>
    <ol>
      <li>Make sure you backend is running on port 3001.</li>
      <li>Open your API and copy the API host.</li>
      <li>Open the .env file (do not open the .env.example)</li>
      <li>
        Add a new variable =<Dark>your api host</Dark>
      </li>
      <li>
        Replace <Dark>your api host</Dark> with the public API URL of your flask
        backend sever running at port 3001
      </li>
    </ol>
    <p>
      Note: If you are publishing your website to Heroku, Render.com or any
      other hosting you probably need to follow other steps.
    </p>
  </div>
);
