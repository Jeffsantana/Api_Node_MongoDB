Api_Node_MongoDB

Starter API Rest with Node.js, express.js, JWT, Mongoose and MongoDB

# Getting started

This is a basic API REST written on JavaScript using async/await. Great for building a starter web API for your front-end (Android, iOS, Vue, react, angular, or anything that can consume an API)

#Features
Multiple environment ready(Development, Test, Production).
Response with Mongoose paginate.
Standardized Message responses.
User profile.
Users list for admin area.
JWT Tokens, make requests with a token after login with Authorization header with value Bearer yourToken where yourToken is the signed and encrypted token given in the response from the login process.
Basic Web page show status of API and Date base.
Use Nodemon
Cors ready
Possible to configure https mode

#Requirements
Node.js 8+
MongoDB 3.6+

#How to Install
Using Git (recommended)
Clone the project from github. Change "myproject" to your project name.

Install npm dependencies after installing
cd ~/myproject
npm install
npm update

#Setting up environments (development or production)
In the root this repository you will find a file named .env.example
Create a new file by copying and pasting the file and then renaming it to just .env
The file .env is already ignored, so you never commit your credentials.
Change the values of the file to your environment (development or production)
Upload the .env to your environment server(development or production)

#How to run development mode
cd ~/myproject
npm start
You will know server is running by checking the output of the command npm start:

---

[nodemon] 1.18.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: _._
[nodemon] starting `node index.js`
Aplication runing in port: 3500
Mongodb connected!

---

see the status information in: http://localhost:3500/api/v1

#How to run production mode
use pm2 (Advanced, production process manager for Node.js) [http://pm2.keymetrics.io/]
bash
npm run production

#Usage
Creating new models
If you need to add more models to the project just create a new file in /src/app/models/ and load+export this file in /src/app/models/index.js

Creating new controllers
If you need to add more controllers to the project just create a new file in /src/app/controllers/ and load+export this file in /src/app/controllers/index.js

Creating new routes
If you need to add more routes to the project just create a new file in /src/app/routes/ and load+export this file in /src/app/routes/index.js

#Responsible
This project is SantanaJeff´s responsability
contact in:
santanajeff@example.mail.com

#License
This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
