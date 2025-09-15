import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function EditTeacher() {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", department: "", subject: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/admin/teachers/${teacherId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

        if (res.ok) {
          const data = await res.json();
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            department: data.department || "",
            subject: data.subject || "",
          });
        } else {
          setError("Failed to load teacher data");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/teachers/${teacherId}`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});

      if (res.ok) {
        alert("Teacher updated successfully");
        navigate("/admin/teachers");
      } else {
        const errData = await res.json();
        alert(errData.message || "Update failed");
      }
    } catch (err) {
      alert("Failed to update teacher");
      console.error("❌ Update error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Teacher</CardTitle>
            <Button
              variant="outline"
              className="text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
              onClick={() => navigate("/admin/teachers")}
              type="button"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <CardDescription>Update teacher information below.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <form onSubmit={handleUpdateTeacher} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Input
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subject"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2B59C3] hover:bg-[#1e4a9f] text-white"
              >
                Update Teacher
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}