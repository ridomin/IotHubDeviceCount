const express = require('express')
const indexRouter = require("./routes");

const app = express()
const port = 3000

app.use(express.static('wwwroot'))  
app.use(express.json())
app.use("/api", indexRouter)

app.get('/hw', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))