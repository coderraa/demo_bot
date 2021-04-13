const express = require('express')
const app = express()
const nodemailer = require("nodemailer");
const axios = require('axios');
let port = process.env.PORT || 3000

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'cokeaglapp@gmail.com',
      pass: 'Cola@2019Dev'
  }
});



app.use(express.json());

async function lastbillpaid() {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid=0009000414');
    console.log(response.status);
    return "Your pending amount of "+response.data.last_bill_paid.date+" is "+response.data.last_bill_paid.amount
  } catch (error) {
    console.error(error);
    return error
  }
}

async function nextbilldue() {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid=0009000414');
    console.log(response.status);
    return "Your Next Bill Due amount of "+response.data.next_bill_due.dueDate+" is "+response.data.next_bill_due.amount 
  } catch (error) {
    console.error(error);
    return error
  }
}

async function soa() {
  try {
    const response = await axios.get('http://qatest.800mycoke.ae:9090/askArwa/getChatResponse.jsp?customerid=0009000414');
    console.log(response.status);
    return response.data.total_outstanding.outstanding
  } catch (error) {
    console.error(error);
    return error
  }
}

app.post('/', (req, res) => {
  console.log(req.body)//this will print request data from dialogflow bot
  if(req.body.queryResult.parameters.Trigger_entity=='Last Bill'){
    lastbillpaid().then(function(resp) {
    console.log(resp)//resp is reponse from get api, 
    //res.send will send this to dialogflow
    res.send({
      "fulfillmentMessages": [
        {
          "text": {
            "text": [JSON.stringify(resp)]
          }
        }
      ]
    })
  })}

  else if(req.body.queryResult.parameters.Trigger_entity=='Next Bill'){
    nextbilldue().then(function(resp) {
      console.log(resp)//resp is reponse from get api, 
      //res.send will send this to dialogflow
      res.send({
        "fulfillmentMessages": [
          {
            "text": {
              "text": [JSON.stringify(resp)]
            }
          }
        ]
      })
    })}
  
  else if(req.body.queryResult.intent.displayName=='Others mail trigger'){
    nextbilldue().then(function(resp) {
      console.log(resp)//resp is reponse from get api, 
      const mailOptions = {
        from: "cokeaglapp@gmail.com", // sender address
        to: "rahul.singh.ds20@gmail.com", // list of receivers
        subject: "Customer Complain", // Subject line
        html: req.body.queryResult.queryText
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        {
          console.log(err);
        }
    });
      //res.send will send this to dialogflow
      res.send({
        "fulfillmentMessages": [
          {
            "text": {
              "text": ["Your query: "+req.body.queryResult.queryText+" has been registered. We will Contact you soon. Thank You"]
            }
          }
        ]
      })
    })}

    else if(req.body.queryResult.intent.displayName=='Others Cooler mail trigger'){
      nextbilldue().then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        const mailOptions = {
          from: "cokeaglapp@gmail.com", // sender address
          to: "rahul.singh.ds20@gmail.com", // list of receivers
          subject: "Cooler Customer Complain", // Subject line
          html: req.body.queryResult.queryText
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if(err)
          {
            console.log(err);
          }
      });
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": ["Your Cooler Complain query: "+req.body.queryResult.queryText+" has been registered. We will Contact you soon. Thank You"]
              }
            }
          ]
        })
      })}

    else if(req.body.queryResult.parameters.Trigger_entity=='SOA'){
      soa().then(function(resp) {
        console.log(resp)//resp is reponse from get api, 
        //res.send will send this to dialogflow
        res.send({
          "fulfillmentMessages": [
            {
              "text": {
                "text": ["Your Outstanding Amount is "+JSON.stringify(resp)]
              }
            }
          ]
        })
      })}
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
