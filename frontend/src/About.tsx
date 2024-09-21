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
           <td>Group meeting was done in class. We discussed what to do: finish up SRS, have to elaborate on every
             single detail, start working on the data model. For the backend: database schema for users, User,
             email and password(hash), API routes for logging in and registering. For the frontend: ,React code for
             a user registration page/window, Remote code for storing a user session when a user logins, Remote code
             for calling the API for logging in and registering.</td>
         </tr>
           <tr>
             <td>9/9</td>
           <td>We discussed what we needed to get done.For user auth: Frontend needs to learn and write code to:
             Write a register and login request handlers to the backend, it will send the username and password to the
             backend Get the token from the backend from login/backend and store the token Write authentication headers
             using the token for every request that will need it in the future Backend needs to: Write routes for
             registering and logging in Make a model in Django for usernames and password hashes Passwords are hashed
             with bcrypt.</td>
           </tr>
           <tr>
             <td>9/10</td>
           <td>On this day one of our group members David dropped the class, and we were mourning the loss of his talent.
              We continued on with what was discussed on the previous days and made progress on those tasks. </td>
           </tr>
           <tr>
           <td>9/11</td>
           <td>On this day we met up at the library campus to work on the SRS. We got most of it complete with the
             functional and nonfunctional requirements done. For the frontend and backend side, work on the
             user registration page was continued although not completed. We also discussed how to continue
             without David on the team. </td>
           </tr>
           <tr>
           <td>9/12</td>
           <td> We met up once again in the library and continued to work on our tasks. Tasks that were discussed
             and worked on were that: remote code should return json data, not also set local storage, Use tailwind don't
             write css from scratch, create login and register page, and make generic elements in react for code reuse. </td>
           </tr>
           <tr>
              <td>9/13</td>
           <td> This meeting was done in class. We previewed the SRS to professor, and was tasked what needed to be
             done with the SRS as well as assigned diagrams. Work on the log-in and register page was done on
             both the frontend and backend. Everyone was assigned a task to get done for the following week. </td>
           </tr>
           <tr>
              <td>9/16</td>
           <td> On this day, the meeting was held during class. The work done on this day was mainly the diagrams
             that were assigned on last class meeting. Important information was discussed like how we are setting
             up the data tables and what features the website will have. </td>
           </tr>
           <tr>
              <td>9/17</td>
           <td> The meeting on this day was held at the library. A lot of the implementation of the data was completed
             on this day. For example, how the data was stored on the database and how to route it to the frontend.
             We progressed with the backend code as well as displaying the data onto the frontend.
           </td>
           </tr>
           <tr>
              <td>9/18</td>
           <td> This meeting was done in class. The meeting was short with nothing new besides to continue the
             work on the models as well as the code for the frontend and backend.
           </td>
           </tr>
           <tr>
              <td>9/19</td>
           <td> This meeting was done in the library. We got a lot of work done on this day. All the models and diagrams
             were completed. The code for the backend was done as well as the schema for the frontend. Only thing left
             after the meeting was printing out the SRS and displaying the data which was finished after the meeting.
           </td>
           </tr>
           <tr>
              <td>9/20</td>
           <td> This meeting was done in class today. We finished the SRS, and presented it to be signed. The
             data tables with mock data was also shown, and we correctly got the assigned tasks done. We also
             discussed what needed to be done on the following week because we already got the login page deployed,
             so we will be getting ahead next week.
           </td>
         </tr>
       </tbody>
     </table>
   </div>
 );
};


export default About;




