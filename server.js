const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const url = require("url");
const path = require("path");
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require("cors");
const shortid = require("shortid");
const Razorpay = require("razorpay");

// Initialize Peer Server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

// Set view engine
app.set("view engine", "ejs");

// Static files
app.use("/public", express.static(path.join(__dirname, "static")));
app.use("/static", express.static(path.join(__dirname, "static")));


app.use("/peerjs", peerServer);
app.use(express.static('public'));


app.use(express.json());


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });




// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "login.html"));
});
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "home.html"));
});
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});
app.get("/sachin", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "aboutmentor.html"));
});

app.get("/chatbot", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chatbot.html"));
});

app.get("/join", (req, res) => {
    res.redirect(
        url.format({
            pathname: `/join/${uuidv4()}`,
            query: req.query,
        })
    );
});

app.get("/joinold", (req, res) => {
    res.redirect(
        url.format({
            pathname: req.query.meeting_id,
            query: req.query,
        })
    );
});

app.get("/join/:rooms", (req, res) => {
    res.render("room", { roomid: req.params.rooms, Myname: req.query.name });
});

// Socket.io connection
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, id, myname) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", id, myname);

        socket.on("messagesend", (message) => {
            console.log(message);
            io.to(roomId).emit("createMessage", message);
        });

        socket.on("tellName", (myname) => {
            console.log(myname);
            socket.to(roomId).broadcast.emit("AddName", myname);
        });

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", id);
        });
    });
});


const apiKey = process.env.AI_API_KEY;
if (!apiKey) {
    throw new Error("API key not found. Please set the AI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};

// Chat API route
app.post('/send-message', async (req, res) => {
    const { message } = req.body;

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(message);
        res.json({ reply: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});




app.post("/razorpay", async (req, res) => {
    const payment_capture = 1;
    const amount = 499;
    const currency = "INR";
  
    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };
  
    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
    }
  });



// Start server
server.listen(process.env.PORT || 3030, () => {
    console.log(`Server is running on port ${process.env.PORT || 3030}`);
});