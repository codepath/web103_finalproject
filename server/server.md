#### To run your server, create a .env at the root of the server, then fill in your environment variables, 

```bash
# .env file example
PORT=3000
BACKEND_URL='http://localhost:3000'
FRONTEND_URL='http://localhost:5173'

PGDATABASE='railway'
PGHOST='junction.proxy.rlwy.net'
PGPASSWORD='123456789abc'
PGPORT=12345
PGUSER='postgres'
DATABASE_URL='postgresql://postgres:123456789abc@junction.proxy.rlwy.net:12345/railway'

GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''

REFRESH_TOKEN_SECRET=''
ACCESS_TOKEN_SECRET=''
```

### Simple env variable walkthrough,
##### Running environment information
```bash
PORT=3000
BACKEND_URL='http://localhost:3000'
FRONTEND_URL='http://localhost:5173'
```
##### Railway with Postgres was used for the database, so make a project there with postgres to get the connection values for the database.
```bash
PGDATABASE='railway'
PGHOST='junction.proxy.rlwy.net'
PGPASSWORD='123456789abc'
PGPORT=12345
PGUSER='postgres'
DATABASE_URL='postgresql://postgres:123456789abc@junction.proxy.rlwy.net:12345/railway'
```
##### For the Github client, go to Github, go to your settings, developer settings, and then make OAuth apps, make a project and get the client id and secret to use for the Github auth.
```bash
GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''
```
##### You can generate your own refresh and access token secrets by simply opening up a terminal, entering the node replit, and generating a secret string,
```bash
node

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
```bash
REFRESH_TOKEN_SECRET=''
ACCESS_TOKEN_SECRET=''
```

#### Install the necessary dependencies
```bash
npm install
```

#### Run your server, enjoy!
```bash
npm start
```