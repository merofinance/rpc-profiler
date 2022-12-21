# RPC Profiler

A tool to profile RPC Endpoints

## Steps to run

1. Rename `example.secrets.js` to `secrets.js`
2. Add your keys to `secrets.js`
3. Ensure [Nodejs](https://nodejs.org/en/) is installed on your machine
4. Run `yarn`
5. Confirm which tests you would like to run. You can comment out some at the bottom of the `index.js` page to only run a subset. It's best not to run the `Speed Tests` and `Concurrent requests tests` at the same time as they might interfere with each other.
6. Run `yarn start`
