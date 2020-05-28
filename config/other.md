Headers are made of:  (look at HTTP headers)
1. General headers: general info i.e. URL, Request Method, status code
2. Request headers: Browswer creates on client behalf..  i.e.  text/html, cookies, user-agent,   
3. Response headers: it'll be set by server,  additional instructions to client,  acknowleges the type of data, set-cookies   

cookies in both request and response
cookies set by server allows the client/browser to remember that the client has successfully logged in, so they don't have to keep logging in every time they send a request

after receiving the cookies from server, browswer will attached those cookies to every request from then onwards

cookie also has an expiry which sets how long you stay logged in.

we can go to inspect/applications/delete cookies/

on client side we have cookies that stores info on browser, on server side we will have sessions which will be stored on server side

cookies: can't save a lot of data, it becomes very tedious, but on server side you can save a lot more data.  Server side is also more advantagous because we cant save credentials/secret info on cookies 

we authenticate in to session with a secret key



HTTP clients ---> HTTP servers.
