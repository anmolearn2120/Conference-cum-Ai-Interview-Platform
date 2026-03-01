import { Server } from "socket.io";

import meetingModel from "../models/meeting.model.js";
import meetingAttendanceModel from "../models/meetingAttendance.model.js";

let connections = {};
let messages = {};

let timeOnline = {};

let activeSession = {};
export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    //connection establish ho gya hai ab join meeting

    socket.on("join-meeting", async ({ meetingCode, userId, username }) => {
      //check if meeting code is valid
      const meeting = await meetingModel.findOne({ meetingCode });
      if (!meeting)
        return socket.emit("error", { message: "Invalid Meeting Code" });
      if (new Date() > meeting.expiresAt)
        return socket.emit("error", { message: "Meeting Expired" });

      // room tarcking ke liye connections
      if (!connections[meetingCode]) {
        connections[meetingCode] = new Set();
      }
      // connections create ho gya
      //ab hum is connection me us room ke user ko add krenge

      connections[meetingCode].add(socket.id);

      // track joining time
      timeOnline[socket.id] = new Date();

      //active Session tracking
      activeSession[socket.id] = {
        userId,
        meetingCode,
        joinedAt: new Date(),
      };

      //join the meeting

      socket.join(meetingCode);

      console.log(`${username} joined meeting ${meetingCode}`);
      // notify other users in the meeting that a new user has joined
      socket.to(meetingCode).emit("User-joined", {
        socketId: socket.id,
        users: Array.from(connections[meetingCode]),
      });

      // old messages in chat agr koi hai tho vo dikha do

      if (messages[meetingCode]) {
        messages[meetingCode].forEach((msg) => {
          socket.emit("chat-message", msg);
        });
      }

      // ****************
      // chat Message System
      //********************** */
      socket.on("chat-message", ({ meetingCode, message, sender }) => {
        if (!connections[meetingCode]) return;
        if (!messages[meetingCode]) {
          messages[meetingCode] = [];
        }

        const messageObject = {
          sender,
          message,
          socketId: socket.id,
        };

        messages[meetingCode].push(messageObject);

        // broadcast the message to all users in the meeting
        io.to(meetingCode).emit("chat-message", messageObject);
      });

      // signaling for WebRTC (video/audio call)

      /*
      ==============================
      SIGNAL (WebRTC Handshake Forwarder)
      ==============================
    */
      socket.on("signal", ({ to, signalData }) => {
        /*
        Ye WebRTC ke offer, answer, ICE candidates forward karta hai.
        Server video stream ko touch nahi karta.
      */

        io.to(to).emit("signal", {
          from: socket.id,
          signalData,
        });
      });

      // OFFER
      socket.on("offer", ({ to, offer }) => {
        io.to(to).emit("offer", {
          from: socket.id,
          offer,
        });
      });

      // ANSWER
      socket.on("answer", ({ to, answer }) => {
        io.to(to).emit("answer", {
          from: socket.id,
          answer,
        });
      });

      // ICE CANDIDATE
      socket.on("ice-candidate", ({ to, candidate }) => {
        io.to(to).emit("ice-candidate", {
          from: socket.id,
          candidate,
        });
      });

      // handle user leaving the meeting
      socket.on("disconnect", async () => {
        // user jab meeting se leave karega toh connections se usko remove krna hai
        //+ use db me store bhi krna hai
        const session = activeSession[socket.id];
        if (session) {
          const { userId, meetingCode, joinedAt } = session;
          const leftAt = new Date();
          const duration = leftAt - joinedAt; // duration
          console.log(
            `${userId} left meeting ${meetingCode} after ${duration} seconds`,
          );

          await meetingAttendanceModel.create({
            user: userId,
            meetingCode,
            joinedAt,
            leftAt,
            duration,
          });
        }

        // removal of user from the rooms

        socket.rooms.forEach((room) => {
          if (connections[room]) {
            connections[room].delete(socket.id);
            // notify other users in the meeting that a user has left
            socket.to(room).emit("User-left", socket.id);

            // if no users are left in the meeting, clean up the connections and messages
            if (connections[room].size === 0) {
              delete connections[room];
              delete messages[room];
            }
          }
        });
      });
    });
  });
};
