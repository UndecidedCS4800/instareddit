import React from 'react';
import './About.css'; // Import CSS

const About: React.FC = () => {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>This is the About Us page.</p>
      <ul>
        <li>Our Mission</li>
        <li>Our Team</li>
        <li>Contact Us</li>
        <li>Meetings:</li>
      </ul>

      {/* 4x2 table with content */}
      <table>
        <tbody>
          <tr>
            <td>9/3</td>
            <td>First group meeting was done on discord. What was discussed was how we need to set up docker and everything.
                We encountered a problem with connection issues while on the call, and it was decided that we should meet 
                in person to work on the project for the following day.</td>
          </tr>
          <tr>
            <td>9/4</td>
            <td>Group meeting was done in person at the library. Everyone was able to get docker set up by this time. 
                The frontend for the button with mock data was completed. We tried to get the backend working but ran into some problems.
                Frontend started working on the company website.</td>
          </tr>
          <tr>
            <td>9/5</td>
            <td>Group meeting was done in person at the library. The about us page with the information for the meeting 
                logs on the company website was completed. Backend has completed setting up with the database being 
                connected to AWS. Discussed that configuration needs to be fixed. Deployment should be ready soon.</td>
          </tr>
          <tr>
            <td>9/6</td>
            <td>Row 4, Column 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default About;
