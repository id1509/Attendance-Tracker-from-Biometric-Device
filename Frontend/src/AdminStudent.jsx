import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  User,
  Phone,
} from "lucide-react";

const API = "http://localhost:3000/users/admin/students";

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

export default function AdminStudent() {
  /* =========================
     STATE
  ========================= */
  const [filters, setFilters] = useState({
    course: "",
    dept: "",
    year: "",
    section: "",
  });

  const [students, setStudents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    enrollment_no: "",
    name: "",
    ph_no: "",
  });

  const showToast = (msg, type = "info") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  /* =========================
     FETCH STUDENTS (FILTERED)
  ========================= */
  const loadStudents = async () => {
    const { course, dept, year, section } = filters;

    if (!course || !dept || !year || !section) {
      showToast("Please fill Course, Dept, Year and Section", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(API, {
        params: { course, dept, year, section },
      });
      setStudents(res.data.students || []);
      setSubmitted(true);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADD STUDENT
  ========================= */
  const addStudent = async () => {
    if (!form.enrollment_no || !form.name) {
      showToast("Enrollment No and Name are required", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API, {
        ...form,
        ...filters, // 👈 attach class info automatically
      });

      setForm({
        enrollment_no: "",
        name: "",
        ph_no: "",
      });

      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add student", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE STUDENT
  ========================= */
  const updateStudent = async (enrollment_no) => {
    setLoading(true);
    try {
      await axios.put(`${API}/${enrollment_no}`, {
        ...form,
        ...filters,
      });

      setEditingId(null);
      loadStudents();
    } catch (err) {
      showToast("Failed to update student", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE STUDENT
  ========================= */
  const deleteStudent = async (enrollment_no) => {
    if (!window.confirm("Delete this student?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API}/${enrollment_no}`);
      loadStudents();
    } catch {
      showToast("Failed to delete student", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EDIT HANDLERS
  ========================= */
  const startEdit = (s) => {
    setEditingId(s.enrollment_no);
    setForm({
      enrollment_no: s.enrollment_no,
      name: s.name,
      ph_no: s.ph_no || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      enrollment_no: "",
      name: "",
      ph_no: "",
    });
  };

  /* =========================
     UI
  ========================= */
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
            Student Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage student records, enrollment, and class information</p>
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

        {/* Filter Form */}
        <div className="relative glass rounded-3xl p-6 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
          <div className="relative">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Select Class
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Course"
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              />
              <Input
                placeholder="Department"
                value={filters.dept}
                onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
              <Input
                placeholder="Section"
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              />
              <Button onClick={loadStudents} disabled={loading}>
                Load Students
              </Button>
            </div>
          </div>
        </div>

        {/* Add Student Form */}
        {submitted && (
          <div className="relative glass rounded-3xl p-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
            <div className="relative">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Student
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enrollment No"
                    className="pl-9"
                    value={form.enrollment_no}
                    disabled={editingId !== null}
                    onChange={(e) => setForm({ ...form, enrollment_no: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Name"
                    className="pl-9"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Phone (optional)"
                    className="pl-9"
                    value={form.ph_no}
                    onChange={(e) => setForm({ ...form, ph_no: e.target.value })}
                  />
                </div>
                <Button onClick={addStudent} disabled={loading} className="shrink-0">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Student Table */}
        {submitted && (
          <div className="relative glass rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl" />
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrollment No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading && students.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                          Loading students...
                        </td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      students.map((s) => (
                        <tr key={s.enrollment_no} className="hover:bg-muted/20 transition-colors">
                          {editingId === s.enrollment_no ? (
                            <>
                              <td className="px-6 py-4 text-sm text-foreground">{s.enrollment_no}</td>
                              <td className="px-6 py-4">
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                              </td>
                              <td className="px-6 py-4">
                                <Input value={form.ph_no} onChange={(e) => setForm({ ...form, ph_no: e.target.value })} />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={() => updateStudent(s.enrollment_no)} disabled={loading}>
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
                              <td className="px-6 py-4 text-sm text-foreground">{s.enrollment_no}</td>
                              <td className="px-6 py-4 text-sm font-medium text-foreground">{s.name}</td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">{s.ph_no || "-"}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => startEdit(s)}>
                                    <Edit2 className="w-3 h-3" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => deleteStudent(s.enrollment_no)} disabled={loading}>
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
        )}
      </div>
    </div>
  );
}