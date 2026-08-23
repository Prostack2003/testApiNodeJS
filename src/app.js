const express = require('express');
const mealsRouter = require("./routes/meals.router");
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");


const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/meals', mealsRouter);
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
app.use(errorHandler)
app.listen(config.port, () => {
    console.log(`New API with Express.JS listening on port ${config.port}`);
});


module.exports = app;
