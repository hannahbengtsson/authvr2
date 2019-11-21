const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const secret = require("./secret");

const users = [
    {id:123, email:"lars@lars.se", password: "$2a$12$k0gv6Ua2mS9CixE8zUoMVeeDsXXrCT4.KXSOu.P8VVVSYcwOSzsAO"},
    {id:55, email:"fredric@fredric.se", password: "$2a$12$xYRtcLxpvuvdRMeLd4p8xeNEPPWomlsPAS6d6LsIwnGSeS6uuTkZC"}
];


const app = express();
//Kommer på provet!!!! vad gör följande rad?
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.get("/",function(req,res){
    res.send(req.cookies);
});

app.get("/secret",auth,function(req,res){
    res.send(req.cookies);
});



app.get("/login",function(req,res){
    res.sendFile(__dirname + "/loginform.html");
});

app.post("/login",function(req,res){


    

   let user = users.filter(function(u){
       if(req.body.email === u.email)
       {return true;}
   });

   if(user.length===1)
   {
        const password = req.body.password;
        const hash = user[0].password;  // hashat lösenord från db/fil/minnede
        // Kontrollera lösenord med bcrypt
        bcrypt.compare(password,hash,function(err,success){
         
            if(success){

                const token = jwt.sign({email:user[0].email},secret,{expiresIn:1800})


                res.cookie("token",token,{httpOnly:true,sameSite:"Strict"});
                res.send("Loggin Success!!!");
            }
            else{
                res.send("Wrong password");
            }

        });

   }
   else{ // Här hamnar vi om det inte existerar användare med rätt email
       res.send("no such user...");
   }

    /**
     * 1. hämta data som klienten skickat ( Repetition )
     * 2. Leta efter användare i databas/fil/minne
     * 3. Om användare ej finns skicka respons till klient med error
     * 4. Om användare finns gå vidare med att kolla lösenord
     * 5. Om löserord ej är korrekt skicka respons till klient med error
     * 6. Om lösenord är korrekt - Skicka respons/redirect 
     * 7. Nu när användaren är inloggad måste hen förbli så ett ta
     *    Detta löser vi med JWT.
     *    Skapa JWT och lagra i cookie innan din respons/redirect
     * 8. Skapa middleware för att skydda vissa routes.
     *    Här skall vi nu använda våra JWT för att hålla en användare inloggad. 
     * 9. Småfix för att förbättra säkerhet och fixa utloggning. 
     */


});

// kollar om systemet har en angiven port, annars 3700...
const port = process.env.PORT || 3700
app.listen(port, function(){console.log("port:" +port)});