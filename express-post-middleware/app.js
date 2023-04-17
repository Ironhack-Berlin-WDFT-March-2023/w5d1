const express = require("express")
const hbs = require("hbs")

const app = express()

// Set hbs as view engine
app.set("view engine", "hbs")


// (1) Middleware

let pageVisits = 0

// This is a middleware - it's just a function
function counter (req, res, next) {
  // Increment page visits
  pageVisits++
  console.log("Page visits: ", pageVisits)

  // A middleware can modify the req-object:
  req.pageVisits = pageVisits
  
  // Call the next middleware
  next()
  
}

// // Registering a middleware globally (for all routes)
// app.use(counter)

// // We can also use an anonymous function
// app.use(function (req, res, next) {
//     // Increment page visits
//     pageVisits++
//     console.log(pageVisits)
    
//     // Call the next middleware
//     next()
// })

/* GET home page */
// Use the middleware only for this route
app.get("/", counter, (req, res, next) => {
  // I can now access the pageVisits on the req-object:
  console.log("Accessing the page visits in the route: ", req.pageVisits)

  res.render("index")
})


// Challenge 1: Create a middleware that logs the time of the request
function timeLogger(req, res, next) {
  const date = new Date()
  const dateString = date.toLocaleString()

  console.log("New request recieved at: ", dateString)

  next()
}

app.get("/", timeLogger, (req, res, next) => {
  res.render("index")
})

// Challenge 2: Create a middleware "SecondsBetweenRequests" that logs the amount of seconds between the last request and the actual request
let lastTime = Date.now()

function secondsBetweenRequests(req, res, next) {
  const secondsBetweenRequests = (Date.now() - lastTime) / 1000

  console.log("Seconds between last and actual request: ", secondsBetweenRequests)

  lastTime = Date.now()

  next()
}

app.get("/", secondsBetweenRequests, (req, res, next) => {
  res.render("index")
})


// (2) POST requests

// Use the bodyParser middleware to parse the body (included in Express)
app.use(express.urlencoded({ extended: true }))

// If it wasn't included in Express, we would require it
// const bodyParser = require("body-parser")
// app.use(body.parser.urlencoded({ extended: true }))

app.get("/signup", (req, res) => {
  // When we do a GET request the browser sends the data in the URL
  // We can access the data with req.query
  const query = req.query
  console.log(query)

  const username = req.query.username
  res.render("dashboard", { user: username })
})

app.post("/signup", (req, res) => {
  // When we do a POST request the browser sends the data in the body
  // We can access the data with req.body
  const body = req.body
  console.log(body)

  const username = req.body.username
  res.render("dashboard", { user: username })
})

// Challenge 3: Create a route that checks if username is "Ironhacker" and password is "password".
// If username and password are correct, display a message "Welcome <username>", otherwise display a message "You are not logged in"
app.post("/signup", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // With destructuring:
  // const { username, password } = req.body

  if (username === "Ironhacker" && password === "password") res.send(`<h1>Welcome ${username}!</h1>`)
  else res.send("<h1>You are not logged in!</h1>")
})


app.listen(3000, function () {
	console.log("Server listening")
})
