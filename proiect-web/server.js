if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const bodyParser = require('body-parser')

  var products = [
    {
        id: 1,
        name: 'laptop'
    },
    {
        id: 2,
        name: 'microwave'
    }
    ];
    
    var currentId = 2;

    var produse = [{
      "id":123,
      "title":"Bell",
      "desc":"Descriere produs",
      "img":"bell-lg.png",
      "price":12.34
  },{
      "id":456,
      "title":"Bullhorn",
      "desc":"Descriere produs",
      "img":"bullhorn-lg.png",
      "price":43.21
  },{
      "id":789,
      "title":"Clock",
      "desc":"Descriere produs",
      "img":"clock-lg.png",
      "price":45.67
  },{
      "id":987,
      "title":"Cog",
      "desc":"Descriere produs",
      "img":"cog-lg.png",
      "price":78.90
  },{
      "id":654,
      "title":"Phone",
      "desc":"Descriere produs",
      "img":"iphone-lg.png",
      "price":76.54
  },{
      "id":321,
      "title":"Lightbulb",
      "desc":"Descriere produs",
      "img":"lightbulb-alt-on-lg.png",
      "price":23.45
  }]
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
const users = []

app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile)
app.use(express.static(__dirname + '/views'))
app.use(express.urlencoded({extended:false}))
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.html')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.get('/products', function(req, res) {
    res.send({ products: products });
  });
app.get('/produse', function(req, res) {
    res.send(produse);
  });

app.post('/products', function(req, res) {
    var productName = req.body.name;
    currentId++;

    products.push({
        id: currentId,
        name: productName
    });

    res.send('Successfully created product!')
});

app.put('/products/:id', function(req, res) {
    var id = req.params.id;
    var newName = req.body.newName;

    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            product.name = newName;
        }
    });

    res.send('Succesfully updated product!');
});

app.delete('/products/:id', function(req, res) {
    var id = req.params.id;

    var found = false;

    products.forEach(function(product, index) {
        if (!found && product.id === Number(id)) {
            products.splice(index, 1);
        }
    });
    res.send('Successfully deleted product!');
});

  app.listen(3000)