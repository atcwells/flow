Flow
====

Be anywhere Angular server

Installation/Run
====

1.) Install MongoDB.

2.) Install NodeJS.

3.) Clone repo.

4.) run 'flow_server/flow/flow.js' from inside the directory.

5.) Navigate to '127.0.0.1:9001' in your browser.

Features
====

Automatic Bower inclusion:
Bower dependencies are searched for Angular modules, modules are included automatically. Currently it's necessary to stop the server, install a package and restart. No further configuration is necessary.

Automatic Asset management:
Assets have ExpressJS routes created automatically, and when files are changed/created within the 'flow_client' directory, routes are automatically updated also.

Editible Schema:
Schema are stored as JSON files (in the 'flow_server/database_schema' directory) in a generic way. These can be altered on the fly using an API.

Strong data types:
Data types such as 'password' or 'email_address' allow automated validation of fields (both in the client and at database level, using the same validation scripts).

Automated forms:
Forms can be generated using ng-repeat directives - see recordForm for an example.

Inline view editing:
ACE editor included to allow editing of HTML partials and corresponding controllers from the applicaiton - no build process.

Cache Manager:
Objects are stored in an in-memory cache where needed, and can retreived in the API as well as in core code.

API:
Javascript API automatically called where URL begins with '/api/OBJECT/METHOD', where OBJECT and METHOD correspond to those within the API files in 'flow_api'.
