const express = require("express")
const hbs = require("hbs")
const movies = require("./movies.json")

const app = express()

// Set hbs as view engine
app.set("view engine", "hbs")

// Register partials to use them with handlebars
hbs.registerPartials(__dirname + "/views/partials")


app.get("/", function (req, res) {
	console.log(movies)
	res.render("movies", { movieList: movies })
})

app.get("/about", function (req, res) {
	// "layout" specifies the layout for this view
	// "False" disables the layout
	res.render("about", { title: "About", layout: false })
})


// Query strings

// http://localhost:3000/search?title=godfather

app.get("/search", (req, res) => {
	// Access query string:
	// req.query.<name of the key>
	const query = req.query
	res.send(query)
})

app.get("/movieSearch", (req, res) => {
	const queryString = req.query.q

	const filteredMovies = movies.filter(movie => {
		return movie.title.toLowerCase().includes(queryString.toLowerCase())
	})

	// res.send(filteredMovies)
	res.render("movies", { movieList: filteredMovies })
})


// Route parameters

// https://github.com/mloelkes

// Let's make our "godfather"-route dynamic with parameters!
app.get("/:title", (req, res) => {
	// Access route parameter:
	// req.params.<name of the parameter>
	const title = req.params.title
	
	const clickedMovie = movies.find(movie => movie.title === title)
	console.log(clickedMovie)
	
	res.render("movieDetails", { movie: clickedMovie })
})

// We can also use multiple parameters in one route
app.get("/movies/:director/:year", function (req, res) {
	const params = req.params
	res.send(params)
})


app.listen(3000, function () {
	console.log("Server listening")
})
