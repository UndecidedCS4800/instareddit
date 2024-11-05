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
         <tr>
              <td>9/23</td>
           <td> On the frontend, We made repo called frontend-browserrouter that migrates from whatever solution 
            you had for routing to the lastest that we could use for the login page. On the backend, we added routes
             for /community/id and /community/id/about.
           </td>
         </tr>
         <tr>
              <td>9/24</td>
           <td> This meeting was held in the library late afternoon. We started work on the diagram and got the 
            first draft of it completed. For the log in page, more work was completed for the backend code and 
            the routes to the frontend.
           </td>
         </tr>
         <tr>
              <td>9/25</td>
           <td> The meeting was held in class. On the backend, tony/auth has the new updated register view with
             more specifc checks and responses to the username, password, and email and also tries to validate
              the password to make sure it is not too weak.
           </td>
         </tr>
         <tr>
              <td>9/26</td>
           <td> The meeting was not held today because of personal reasons with the CEO, but tasks were assigned 
            online over text. For the frontend, work on the scaffolding and design continued. On the backend,
            review was done on the code and fixed some of the errors with it, and the diagram also had another
            draft completed.
           </td>
         </tr>
         <tr>
              <td>9/27</td>
           <td> The meeting was held during class hours. We showed professor the completed log in page,
            but we weren't able to get it deployed in time. Also, the task for next week was assigned.
            We discussed how we would tackle it for the upcoming week.
           </td>
         </tr>
         <tr>
              <td>9/30</td>
           <td> This meeting was held in person during class. For the frontend, we created the types and
            code for the backend routes. For the backend, we made a route with a list of all the communities
            paginated, optionally there will be a querystring to filter out results sorted by subscriber count.

           </td>
         </tr>
         <tr>
              <td>10/1</td>
           <td> This meeting was held in person in the library at the usual meeting time. For the frontend,
           a lot of code for the frontend about 20 components were completed. Tasks for styling the componenets
           were assingned. For the backend, the routes were worked on with many decisions on how they should 
           work was done.
           </td>
         </tr>
         <tr>
              <td>10/2</td>
           <td> The meeting was held in person in the library at the usual meeting time. For the frontend,
            the navbar was updated and tabs for the recent activity and community was added, and more
            styling was worked on. For the backend, we finalized what functions the posts will have for 
            the showing on friday.
           </td>
         </tr>
         <tr>
              <td>10/3</td>
           <td> This meeting was held in person in the library at the usual meeting time. A basic styling
            for the community tab post screen, and create post was completed. The backend code for creating post
            was already completed. We got the build complete and deployed it to the cloud.
           </td>
         </tr>
         <tr>
              <td>10/4</td>
           <td> The meeting was held in class on this date. The completed page for creating post was shown to professor
            along with the community tab. Also, the tasks for next week were revealed.
           </td>
         </tr>
         <tr>
              <td>10/7</td>
           <td> Group meeting was held in class. We discussed what needed to be done with messaging system, and
             tasks were assigned accordingly to each member. There were some employees who worked overtime on the
            weekend and started progress on the messaging system.
           </td>
         </tr>
         <tr>
              <td>10/8</td>
           <td> Due to personal issues with team members, there was no meetings held and just continue on work that
             needs to be done.
           </td>
         </tr>
         <tr>
            <td>10/9</td>
            <td>This meeting was held during class time. We went over the changes we had made, and everyone was able
               to present their changes. We all agreed on the directions for the messaging. No problems have
               arisen, so continue as planned.</td>
          </tr>
          <tr>
            <td>10/10</td>
            <td>This meeting was held in the library. We went over the changes we had made, and everyone was able
               to present their changes. The backend was able to finish and all that was left was the frontend.</td>
          </tr>
          <tr>
            <td>10/11</td>
            <td>This meeting was held during class hours. Messaging was completed on both the frontend and backend.
              All progress was shown in sprint and we got the assigned task for the next sprint as well as details
              for the final.</td>
          </tr>
          <tr>
            <td>10/14</td>
            <td>This meeting was held during class hours. The Architecture Design Document was worked on.
              The plans for the notifications details for the frontend and backend were discussed.
            </td>
          </tr>
          <tr>
            <td>10/15</td>
            <td>This meeting was held in the library. Everyone discussed all the progess we have made.
              The Architecture Design Document was completed and is now ready to show to professor.
              Progress on the frontend and backend were completed.
            </td>
          </tr>
          <tr>
            <td>10/16</td>
            <td>This meeting was held in the library. The Architecture Design Document was shown to 
              professor and was fully completed. The backend for the notifications system was also 
              completed. Frontend is continuing to make progress.
            </td>
          </tr>
          <tr>
            <td>10/17</td>
            <td>This meeting was held in the library. The main focus for this day was midterm.
              A group study session was held.
            </td>
          </tr>
          <tr>
            <td>10/18</td>
            <td>This was day of midterm. Everyone was focused on that and frontend team 
              completed their work, so the system was ready to show for the next sprint.
            </td>
          </tr>
          <tr>
            <td>10/21</td>
            <td> The meeting was held in person today. Notifications was shown in sprint
              and met all the required conditions. The next sprint for the profile page
              was announced.
            </td>
          </tr>
          <tr>
            <td>10/22</td>
            <td> The meeting was held in person today. We all discussed what needed to be done 
              on both the frontend and backend sides for the project. 
            </td>
          </tr>
          <tr>
            <td>10/24</td>
            <td> The meeting was held in person today. The backend and frontend progress was
              continued with no issues arising.
            </td>
          </tr>
          <tr>
            <td>10/24</td>
            <td> The meeting was held in person today. The backend and frontend progress was
              continued with no issues arising. The backend was completed.
            </td>
          </tr>
          <tr>
            <td>10/25</td>
            <td> The meeting was held in person today. The backend and frontend progress was
              continued with no issues arising. The frontend was completed.
            </td>
          </tr>
          <tr>
            <td>10/28</td>
            <td> The meeting was held in person today. The profile page was completed and shown 
              to professor in sprint. The next topic was testing was announced and we assigned
              tasks accordingly.
            </td>
          </tr>
          <tr>
            <td>10/29</td>
            <td> The meeting was held in person today. We all met up to learn how to do the testing
              on both ends and what to include in the document.
            </td>
          </tr>
          <tr>
            <td>10/30</td>
            <td> The meeting was held in person today. Progress on the testing was continued, nothing
              of note.
            </td>
          </tr>
          <tr>
            <td>10/31</td>
            <td> Halloween is a company Holiday. No meeting today.
            </td>
          </tr>
          <tr>
            <td>11/1</td>
            <td> The meeting was held in person today. Progress on the testing was continued
              and we should be ready for sprint next Monday.
            </td>
          </tr>
          <tr>
            <td>11/4</td>
            <td> The meeting was held online for today since class was cancelled. We discussed
              what we got completed and proceeded to do other tasks like completing styling 
              for the profile page.
            </td>
          </tr>
          
       </tbody>
     </table>
   </div>
 );
};


export default About;




