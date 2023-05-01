# Made with MongoDB, Node.js, Express.js

## How to use

1. Install Node.js
2. Use "npm install"-command in this folder to install package
3. Then use:

- "npm test" to run tests.
- "npm dev" to run in development mode
- "npm start" to run normally
- You can also declare PORT=XXXX before npm

Functions and routing are separated controller.
So if you are using postman endpoints can be found in Routes folder.

- matches use /matches/\*
- player use /players/\*
- matches use /scores/\*
- login uses only /login7

### Technical details

- Routing and basic function made with Express.js.
- Used Mongoose to connect to MongoDB and handle models and queries.
- Tests made with Jest and linted with eslint.
- Loggers used with command line are in config folder.
- Password encryption with bcrypt
- Used jsonwebtoken with login, but I didn't configure it with request because this data isn't that sensitive but may apply it just for fun.
