# Backend Coding Challenge: Subscriptions API
## About the project
The main goal of this project is to offer a single and complete API that help you to manage susbscriptions from a Games Provider Company, offering different membership options, every membership brings you access to different games and depending your membership level, you can be limited or unlimited to access the complete game library of this company.

## Project technologies and tools 
This project is created with the next technologies:
* <span style="font-size:larger;">__Typescript__</span> as programming language that extends Javascript.
* <span style="font-size:larger;">__Mongodb__</span> as DBMS (Database Managment System).
* <span style="font-size:larger;">__Nodejs__</span> as server-side JavaScript execution environment.
* <span style="font-size:larger;">__Express__</span> as Nodejs framework for easier development.
* <span style="font-size:larger;">__JWT__</span> better called Json Web Token, as authentication manager.

Libraries and dependencies that are part of this project:
* <span style="font-size:larger;">__Axios__</span> for HTTP requests.
* <span style="font-size:larger;">__Bcrypt__</span> for passwords hashing.
* <span style="font-size:larger;">__Colors__</span> to give colors to server messages. 
* <span style="font-size:larger;">__Cors__</span> as Cross-Origin Resource Sharing middleware.
* <span style="font-size:larger;">__Dotenv__</span> for enenvironment variables managment.
* <span style="font-size:larger;">__Helmet__</span> as securing Express middleware.
* <span style="font-size:larger;">__Joi__</span> as data validator helper.
* <span style="font-size:larger;">__Morgan__</span> that helps to create logs about every HTTP request.
* <span style="font-size:larger;">__Node-cache__</span> as cache manager.
* <span style="font-size:larger;">__Node-cron__</span> that allows you to schedule tasks to run at specific times
* <span style="font-size:larger;">__Winston__</span> that provides support for multiple transports (such as console, file, HTTP, email, etc.).

# Main steps to run the project
Following that, we can move on to the next step in the process. Below you can see the ordered steps to run this application.

## 1. Global required installations:
You have to assure yourself to have installed this global tools in your computer:
* __Install Node.js and npm:__ Make sure you have Node.js installed on your system. You can download and install Node.js from its official website: Node.js website.

* __Install TypeScript:__ This project is written in TypeScript, so you'll need to have TypeScript installed globally. You can install TypeScript globally using npm with the following command:
```sh
npm install -g typescript
```

* __Install nodemon:__ nodemon is a tool that helps in developing Node.js-based applications by automatically restarting the application when it detects changes in project files. You can install nodemon globally using npm with the following command:
```sh
npm install -g nodemon
```

* __Download MongoDB:__ You can download MongoDB from the official website: MongoDB Download Center.

* __Install MongoDB:__ Follow the installation instructions provided for your operating system on the MongoDB website.

* __Start MongoDB:__ After installation, start the MongoDB server. The process for starting MongoDB may vary depending on your operating system. Typically, you'll run a command to start the MongoDB server. For example, on Linux, you might use the following command:
```sh
sudo service mongod start
```
On Windows, you might use:
```sh
mongod
```
Make sure MongoDB is running before you start the project.

* __Download and install Git:__ Go to the official Git website and download the installer for your operating system (Windows, macOS, or Linux).

## 2. Clone Github project
Open a terminal of your preference, either Bash or Power Shell, it's up to your discretion, fix a destination folder and execute the next command:
```sh
https://github.com/MemoSan27/express-ts-susbscriptions.git
```

## 3. Open VSCode (Visual Studio Code):
After cloning the repository, we need to open the cloned folder in our Visual Studio Code to start the initial the run process.

## 4. Node Modules install:
This is one of the most important steps, open a terminal in your VSCode, you have to be in the project root directory and after be sure of this, execute the next command:
```sh
npm install
```
Wait a few seconds or minutes (depending your internet speed, etc.) and after this finished take care for the next step.

## 5. Create the database
After you installed all node modules, you have to go to MongoDB Shell or you can do this step in Mongo Compass if you have installed it, you have to create a database, we suggest you this name for your database:
```sh
susbscriptions
```
But you can be free to name your database as you like.

## 6. Environment config
You can see in the root project the next file:
```sh
.env.template
```
After you ubicate this file, you have to select it, copy and paste in the root project with the next name:
```sh
.env
```
That's mandatory to use this exactly name for the app functionality.

Now you can see some blank variables that you have to type, in the next table we explain you what is the functionality about each variable:
| Variable | Description |
| --- | --- |
| APP_ENV | Environment to run the app in: default is `dev` |
| APP_PORT | Port to run the server on: default is `3000` |
| APP_URL | Has the URL that is running the server, for example: http://localhost |
| MONGO_URI | URI to connect to the MongoDB database, for example: mongodb://localhost:27017/your-data-base-name |
| MONGO_DB | Name of the database to use, for example: subscriptions |
| SEED_ADMIN_NAME | This project has roles, so, we need to seed the first "superadmin", this joins to databese y a collection named: "admins", so you can start with your real name to register yourself |
| SEED_ADMIN_EMAIL | Same as seed admin name, but here you have to type an email |
| SEED_ADMIN_PASSWORD | Type a secure password for your admin account |
| TOKEN_SECRET | Type a secure string to sign your json web tokens |
| CORS_ORIGIN | This is a security variable for cors, you can just type * if you won't have restrictions in your requests |
| CORS_METHODS | Type all the HTTP methods that you will allow in your server (GET,POST,PUT,PATCH,DELETE) |
| CORS_HEADERS | Used to specify which HTTP headers are allowed in CORS requests. For example: Authorization,Content-Type  |

## 7. Run the server
This is the last step, you have just to run a single command, depending your environment.

### Development environment:
Execute the next command to run the server:
```sh
npm run dev
```
And it has to run the server so you can start to work!!.

### Production environment
You have first to transpile your typescript code to javascript, you have to execute in your terminal the next comand:
```sh
tsc
```
This command is going to generate a new folder in the project root, to run the server you have just to execute the next command:
```sh
node dist/server.js
```
After that, the server is going to run so you can start to work!!.

##8. Visit the API documentation:
This API is documented in Postman and endpoints are tested with this amazing tool, be free to use the tool of your preference.
This API has admin and customers (users) roles, so you have to take care about the needs.

Here is the link of Postmans Docs:
## https://documenter.getpostman.com/view/27921379/2sA35G2gYR

### Any issue or problem, please contact the project admin.

### Thanks for your attention and HAPPY HACKING!!.
