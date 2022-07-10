const express = require('express');
const app = express();
const port = 3000;

const methodOverride = require('method-override');

const {v4: id} = require('uuid');

let movieData = require('./movie.json');

for (let movie of movieData) {
    movie.id = id();
}


app.set('view engine', 'ejs');
app.use(express.static('style'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

// home page
app.get('/', (req, res) => {
    res.render('home');
})

// see all the movies
app.get('/movies', (req, res) => {
    res.render('Page', { movieData });
})

// search movie
app.get('/movies/search', (req, res) => {
    const { q } = req.query;
    const nameRequest = q[0].toUpperCase() + q.slice(1);
    const findMovie = movieData.filter(m => m.name.indexOf(nameRequest) != -1);
    res.render('searchBox', { movieData: findMovie })
})

// each movie
app.get('/movies/:id', (req, res) => {
    const {id} = req.params;
    const findMovie = movieData.find(m => m.id == id);
    res.render('eachMovie', { data: findMovie});
})




// add your movie
app.get('/addmovie', (req, res) => {
    res.render('addmovie');
})

app.post('/addmovie', (req, res) => {
    const {name, country, year, img, trailer, details} = req.body;
    movieData.push({name, country, year, img, id: id(), trailer, editable: true, details});
    res.redirect('/movies')
})

// movie based on the year
app.get('/date', (req, res) => {
    res.render('dateMovie')
})

app.get('/date/:id', (req, res) => {
    const {id} = req.params;
    const findMovie = movieData.filter(m => m.year == parseInt(id));
    res.render('yearMovie', { findMovie })
})

// edit the movie
app.get('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
    const findMovie = movieData.find(m => m.id == id);
    res.render('edit', { data: findMovie })
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const findMovie = movieData.filter(m => m.id != id);
    movieData = findMovie;
    res.redirect('/movies');
})


app.patch('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
    const {name, country, year, details} = req.body;
    const findMovie = movieData.find(m => m.id == id);
    findMovie.name = name;
    findMovie.country = country;
    findMovie.year = year;
    findMovie.details = details;
    res.redirect('/movies')
})


// trailer
app.get('/trailer', (req, res) => {
    res.render('trailer', { movieData });
})


// about me
app.get('/about', (req, res) => {
    res.render('about');
})

app.listen(port, () => {
    console.log(`Listening to ${port}`)
})