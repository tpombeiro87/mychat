Chat challenge
==============

Run Client (from the root of the project):
  ```
  cd ./client && npm install && npm start
  ```

Run Server (from the root of the project):
  ```
  cd ./server && npm install && npm start
  ```

To build Client using webpack from create-react-app:
  ```
  cd ./client && npm build
  ```

NOTES:
  * If you are running everything locally in order to see the localStorage Functionality working you have to have the chat in an incognito page (at least one of them) so the localStorage is not shared

MISSING REQUIREMENTS:
  1. When the user is typing, indication that they are typing should be shown to the other user.
  3. When a new message arrives, it should slide in, and the messages above slide up


IF HAD MORE TIME:
  * TESTS on server / client - rendering and on ui logic
  * better and more commit msgs
  * prettier chat bubbles
  * implement maybe redux saga for controlling the update of the localStorage after a new message
