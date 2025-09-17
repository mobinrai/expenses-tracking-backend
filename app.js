import express from  'express'
import connectionDb from './lib/connectDb.js'
import categoryRoute from './routes/categoryRoute.js'
import userRoute from './routes/userRoute.js'
import accountRoute from './routes/accountRoute.js'
import transactionRoute from './routes/transactionRoute.js'
import budgetRoute from './routes/budgetRoute.js'
import recurringTransactionRoute from './routes/recurringTransactionRoute.js'
import authRoute from './routes/authRoute.js'
import cors from 'cors'
const app = express()

app.use(cors(process.env.CLIENT_URL))
app.use(express.json())

// allow cross-origin requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use("/auth", authRoute)
app.use("/categories", categoryRoute)
app.use("/users", userRoute)
app.use("/accounts", accountRoute)
app.use("/transactions", transactionRoute)
app.use("/recurring-transactions", recurringTransactionRoute)
app.use("/budgets", budgetRoute)

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        message:error.message,
        stack:error.stack
    })
})

app.listen(process.env.PORT, ()=>{
    connectionDb()
    console.log('Server is runing in port 3000')
})