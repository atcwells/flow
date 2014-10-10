# Flow

Be anywhere Angular server

## Installation/Run

1.) Install MongoDB.

2.) Install NodeJS.

3.) Clone repo.

4.) run 'flow_server/flow/flow.js' from inside the directory.

5.) Navigate to '127.0.0.1:9001' in your browser.

## Features

#### Automatic Bower inclusion:
Bower dependencies are searched for Angular modules, modules are included automatically. Currently it's necessary to stop the server, install a package and restart. No further configuration is necessary.

#### Automatic Asset management:
Assets have ExpressJS routes created automatically, and when files are changed/created within the 'flow_client' directory, routes are automatically updated also.

#### Editible Schema:
Schema are stored as JSON files (in the 'flow_server/database_schema' directory) in a generic way. These can be altered on the fly using an API.

#### Strong data types:
Data types such as 'password' or 'email_address' allow automated validation of fields (both in the client and at database level, using the same validation scripts).

#### Automated forms:
Forms can be generated using ng-repeat directives - see recordForm for an example.

#### Inline view editing:
ACE editor included to allow editing of HTML partials and corresponding controllers from the applicaiton - no build process.

#### Cache Manager:
Objects are stored in an in-memory cache where needed, and can retreived in the API as well as in core code.

#### API:
Javascript API automatically called where URL begins with '/api/OBJECT/METHOD', where OBJECT and METHOD correspond to those within the API files in 'flow_api'.

## License

(The MIT License)

Copyright (c) 2014 Alex Wells &lt;atcwells@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
