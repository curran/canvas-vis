Just a generic static file server.

Run with Node.js using the command 'node app.js' in a terminal.

Needed to locally run pages that make local AJAX requests (e.g. to fetch text files at relative URLs).

If file URLs are used to load HTML pages that make local AJAX requests,
the browser (Chrome) complains with the following error:
"Origin null is not allowed by Access-Control-Allow-Origin."

Solution: use this server to serve the files.
