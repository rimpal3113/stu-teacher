"use client";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/Textarea";

export default function StudentMessages() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();
  const { teacherId } = useParams(); // route: /student/messages/:teacherId
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages and teacher info
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/student/messages/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
        setTeacher(data.teacher || null);
      }
    };

    if (teacherId) fetchMessages();
  }, [teacherId]);

  // Handle sending message
  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");

    if (!messageText.trim()) return;

    const res = await fetch("http://localhost:5000/api/student/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teacherId, message: messageText }),
    });

    const data = await res.json();

    if (res.ok) {
      const newMsg = {
        message: messageText,
        sender: "student",
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setMessageText("");
    } else {
       console.error("❌ Send message failed:", data?.message || data);

      alert("❌ Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-[#2B59C3]" />
            <h1 className="text-xl font-bold text-gray-900">
              Chat with {teacher?.name || "Teacher"}
            </h1>
          </div>
          <Button
            variant="outline"
            className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
            onClick={() => navigate("/student/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-5xl mx-auto w-full">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          <div className="flex flex-col space-y-3">
            {messages.map((msg, idx) => {
              const isStudent = msg.sender === "student";
              return (
                <div
                  key={idx}
                  className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm ${
                    isStudent
                      ? "self-end bg-blue-100 text-blue-800 rounded-br-none"
                      : "self-start bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                 <p className="text-xs text-gray-500 text-right mt-1">
  {new Date(msg.createdAt || msg.time).toLocaleString()}
</p>

                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t bg-white py-4 px-6 shadow-inner">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <Textarea
            placeholder="Write your message..."
            className="flex-1 resize-none border border-gray-300 rounded-md px-3 py-2"
            rows={2}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-[#2B59C3] text-white hover:bg-[#1e47a0] px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
