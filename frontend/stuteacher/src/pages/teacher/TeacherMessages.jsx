"use client";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { useAuth } from "../../contexts/AuthContext";

export default function TeacherMessages() {
  const { studentId } = useParams();
  const location = useLocation();
  const studentName = location.state?.name || "Student"; // ✅ Fallback if name not passed
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://stu-teacher-241z.vercel.app/api/messages/teacher/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages || []);
        } else {
          console.error("❌ Failed to fetch messages:", data.message);
        }
      } catch (err) {
        console.error("❌ Server error while fetching messages:", err);
      }
    };

    if (studentId && token) fetchMessages();
  }, [studentId, token]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Messages with {studentName}</h2>

      <div className="space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-3 rounded-md max-w-xl ${
                msg.sender === "teacher"
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
