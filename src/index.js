const express = require('express');
const passport = require('passport');
const path = require('path');

const port = process.env.PORT || 5000;
const app = express();

// Load Routes
const userRouter = require('./routers/user');
const profileRouter = require('./routers/profile');

app.use(express.json());

// Configure passport Authentication middleware
app.use(passport.initialize());
require('./authentication/passport')(passport);


// App routes or endpoints
app.use(userRouter);
app.use(profileRouter);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
};

app.listen(port, () => {
    console.log(`Express server is up on port ${port}`);
});