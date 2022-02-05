# Mystery Chat BE

## Here is the steps to make our project working

- first clone this repo
  > use command
  > **$ git clone git@github.com:bhavin-strinix/mystery_chat.git**
  - After Cloning first do $ npm install
  - $ npm run watch to start server

## Required thing's not to do with this project

- don't work in **master** branch
- to work in this project Create your seprate local branch from master with meaning full name
- then raise PullRequest recpectedly to review your changes by Author
- give meaning full commit messages

## Initial setup Of system to work on this project

- Code editor **Visual Studio Code**
  > with This Extensions
  > | Extension Name | Description | Imporna |
  > | :--- | :--- | ---: |
  > | **Prettier** | To automaticaly Well Formate your code | Required |
  > | **SonarLint** | Run time error indicatior | Required |
  > | **GitLens** | View the line commited by | optional |
  > | **Bracket Pair Colorizer 2** | improve code view by making every bracket color full to understand code | optional |

## to make gmail accoutn able to send mail via node backend
- https://myaccount.google.com/lesssecureapps

## Create and Run Migration
- npx sequelize-cli migration:generate --name <name>
- npx sequelize-cli db:migrate

## Run Seeder 
- npx sequelize-cli db:seed:all  
- npx sequelize-cli db:seed --seed <seed-file-name>