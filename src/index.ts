import express from 'express';
import cors from 'cors'

const app = express();



// PORT
app.set('port', process.env.PORT || 3000);



//////////////// CORS ////////////////

const allowedOrigins = [
    'http://localhost:5173',
    'https://trading-signals-eight-azure.vercel.app/'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(' Origin not allowed:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 204
}));


app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

///////////////////////////////////7////

app.use(express.json)

// ROUTES

app.get('/', (req, res) => {
    res.json({
        status: 'Success',
    message: 'Server running and this it the main route'
    })
})


// SERVER   
const PORT = app.get('port')
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})


