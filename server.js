// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// const io = require("socket.io")(server);
// const { ExpressPeerServer } = require("peer");
// const url = require("url");
// const peerServer = ExpressPeerServer(server, {
//     debug: true,
// });
// const path = require("path");

// app.set("view engine", "ejs");
// app.use("/public", express.static(path.join(__dirname, "static")));
// app.use("/peerjs", peerServer);
// app.use(express.static('public'));
// app.use(bodyParser.json());
// require('dotenv').config();
// const { GoogleGenerativeAI } = require('@google/generative-ai');



// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "static", "index.html"));
// });

// app.get("/join", (req, res) => {
//     res.redirect(
//         url.format({
//             pathname: `/join/${uuidv4()}`,
//             query: req.query,
//         })
//     );
// });

// app.get("/joinold", (req, res) => {
//     res.redirect(
//         url.format({
//             pathname: req.query.meeting_id,
//             query: req.query,
//         })
//     );
// });

// app.get("/join/:rooms", (req, res) => {
//     res.render("room", { roomid: req.params.rooms, Myname: req.query.name });
// });

// io.on("connection", (socket) => {
//     socket.on("join-room", (roomId, id, myname) => {
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit("user-connected", id, myname);

//         socket.on("messagesend", (message) => {
//             console.log(message);
//             io.to(roomId).emit("createMessage", message);
//         });

//         socket.on("tellName", (myname) => {
//             console.log(myname);
//             socket.to(roomId).broadcast.emit("AddName", myname);
//         });

//         socket.on("disconnect", () => {
//             socket.to(roomId).broadcast.emit("user-disconnected", id);
//         });
//     });
// });



// // Initialize GoogleGenerativeAI
// const apiKey = process.env.AI_API_KEY;
// if (!apiKey) {
//     throw new Error("API key not found. Please set the AI_API_KEY environment variable.");
// }

// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({
//     model: 'gemini-1.5-flash',
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: 'text/plain',
// };

// app.use(express.static('public'));
// app.use(express.json());

// app.post('/send-message', async (req, res) => {
//     const { message } = req.body;

//     try {
//         const chatSession = model.startChat({
//             generationConfig,
//             history: [],
//         });

//         const result = await chatSession.sendMessage(message);
//         res.json({ reply: result.response.text() });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while processing the request.' });
//     }
// });




// server.listen(process.env.PORT || 3030);


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

// Initialize Peer Server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

// Set view engine
app.set("view engine", "ejs");

// Static files
app.use("/public", express.static(path.join(__dirname, "static")));
app.use("/peerjs", peerServer);
app.use(express.static('public'));

// JSON body parsing
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
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

// Initialize GoogleGenerativeAI
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

// Start server
server.listen(process.env.PORT || 3030, () => {
    console.log(`Server is running on port ${process.env.PORT || 3030}`);
});
