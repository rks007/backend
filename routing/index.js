const express = require('express');
const app = express();

const userRoute = require('./routes/users');//importing the module 
const managerRoute = require('./routes/manager');

app.use('/users', userRoute);//you are telling the machine that when /users http request hit the use the userRoute folder

app.use('/manager', managerRoute);

app.listen(3000);
