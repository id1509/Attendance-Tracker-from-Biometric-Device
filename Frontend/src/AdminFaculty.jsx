import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Plus, Edit2, Trash2, Save, X, Shield, Phone, Mail, User } from "lucide-react";

const API = "http://localhost:3000/users/admin/faculty";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const BUTTON_VARIANTS = {
  primary: "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 hover:brightness-110",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/80",
};

const BUTTON_SIZES = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 rounded-xl px-8 text-base",
  icon: "h-9 w-9",
};

const Button = ({ children, variant = "primary", size = "default", className = "", ...props }) => (
  <button
    className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    facultyid: "",
    Name: "",
    email: "",
    password: "",
    phoneno: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadFaculty();
  }, []);

  const showToast = (msg, type = "info") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setFaculty(res.data.faculty || []);
    } catch (err) {
      setError("Failed to load faculty list");
      showToast("Failed to load faculty list", "error");
    } finally {
      setLoading(false);
    }
  };

  const addFaculty = async () => {
    if (!form.facultyid || !form.Name || !form.email || !form.password) {
      showToast("Faculty ID, Name, Email and Password are required", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API, form);

      setForm({
        facultyid: "",
        Name: "",
        email: "",
        password: "",
        phoneno: "",
        status: "Active",
      });

      showToast("Faculty added successfully", "success");
      loadFaculty();
    } catch (err) {
      console.error(err.response?.data || err);
      showToast(err.response?.data?.error || "Failed to add faculty", "error");
    } finally {
      setLoading(false);
    }
  };


  const updateFaculty = async (id) => {
    if (!form.Name || !form.email) {
      showToast("Name and email are required", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Name: form.Name,
        email: form.email,
        phoneno: form.phoneno,
        status: form.status,
      };

      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      await axios.put(`${API}/${id}`, payload);
      setEditingId(null);
      showToast("Faculty updated successfully", "success");
      loadFaculty();
    } catch (err) {
      console.error(err.response?.data || err);
      showToast(err.response?.data?.error || "Failed to update faculty", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Faculty deleted successfully", "success");
      loadFaculty();
    } catch (err) {
      showToast("Failed to delete faculty", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (f) => {
    setEditingId(f.facultyid);
    setForm({
      Name: f.Name,
      email: f.email,
      password: "",      // ✅ DO NOT preload
      phoneno: f.phoneno,
      status: f.status,
    });
  };


  const cancelEdit = () => {
    setEditingId(null);
    setForm({ Name: "", email: "", password: "", phoneno: "", status: "Active" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Faculty Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage faculty accounts, roles, and status</p>
        </div>

        {/* Toast */}
        {message && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
              message.type === "error" ? "bg-red-600" : message.type === "success" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Faculty Form */}
        <div className="relative glass rounded-3xl p-6 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
          <div className="relative">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Faculty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Faculty ID"
                  value={form.facultyid}
                  onChange={(e) => setForm({ ...form, facultyid: e.target.value })}
                />
                <Input
                  placeholder="Full Name"
                  className="pl-9"
                  value={form.Name}
                  onChange={(e) => setForm({ ...form, Name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-9"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Phone (optional)"
                  className="pl-9"
                  value={form.phoneno}
                  onChange={(e) => setForm({ ...form, phoneno: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <Button onClick={addFaculty} disabled={loading} className="shrink-0">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Table */}
        <div className="relative glass rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading && faculty.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                        Loading faculty...
                      </td>
                    </tr>
                  ) : faculty.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                        No faculty found
                      </td>
                    </tr>
                  ) : (
                    faculty.map((f) => (
                      <tr key={f.facultyid} className="hover:bg-muted/20 transition-colors">
                        {editingId === f.facultyid ? (
                          <>
                            <td className="px-6 py-4 text-sm text-foreground">{f.facultyid}</td>
                            <td className="px-6 py-4">
                              <Input value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value })} />
                            </td>
                            <td className="px-6 py-4">
                              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </td>
                            <td className="px-6 py-4">
                              <Input value={form.phoneno} onChange={(e) => setForm({ ...form, phoneno: e.target.value })} />
                            </td>
                            <td className="px-6 py-4">
                              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </Select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" onClick={() => updateFaculty(f.facultyid)} disabled={loading}>
                                  <Save className="w-3 h-3" />
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="w-3 h-3" />
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-sm text-foreground">{f.facultyid}</td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{f.Name}</td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{f.email}</td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{f.phoneno || "-"}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  f.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                }`}
                              >
                                {f.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => startEdit(f)}>
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteFaculty(f.facultyid)} disabled={loading}>
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}