
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { urlencoded } = require('body-parser');
const https = require('https');


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const fName = req.body.fname;
    const lName = req.body.lname;
    const Email = req.body.email;


    const data = {
        members: [{
            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/0037c1df89";
    const options = {
        method:"POST",
        auth: "sm157:018f9ebd81adf696ceb055c496bd7940-us10"
    }

    const request = https.request(url, options, function(response){
                        if(response.statusCode==200){
                            res.sendFile(__dirname + "/success.html");
                        } else {
                            res.sendFile(__dirname + "/failure.html");
                        }



                        response.on("data", function(data){
                        console.log(JSON.parse(data));
                    });
    });

    request.write(jsonData);
    request.end();

    app.post("/failure", function(req, res){
        res.redirect("/");
    });

});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started running on port 3000");
});


//   mailchimp api - 018f9ebd81adf696ceb055c496bd7940-us10
//   audience id - 0037c1df89
//   To https://git.heroku.com/serene-scrubland-45330.git
