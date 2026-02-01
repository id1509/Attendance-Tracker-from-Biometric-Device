const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const csv = require("csv-parser");
const { Readable } = require("stream");
const { registerUser, loginUser, logout } = require("../controllers/authController");

// Supabase Client
const supabase = require("../supabaseClient");

// ==========================
// BASIC ROUTES
// ==========================
router.get("/", (req, res) => {
    res.send("Hi");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

// ==========================
// ADD COURSE
// ==========================
router.post("/add-course", async (req, res) => {
    const { courseName, department, year, section } = req.body;

    const { data, error } = await supabase
        .from("courses")
        .insert([{ courseName, department, year, section }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, data });
});

// =====================================================
// 🔥 IMPORTANT FIXED VERSION — GET STUDENTS + FINAL STATUS
// =====================================================
const getTodayDate = () => new Date().toISOString().split("T")[0];


// ==========================================
// 2. GET ROUTE: Load Students
// ==========================================
router.get("/students", async (req, res) => {
  const { course, dept, year, section } = req.query;

  try {
    /* --------------------------------------------------
       1️⃣ LOAD CSV → fingerprint_scans
    -------------------------------------------------- */
    await supabase
      .from("fingerprint_scans")
      .delete()
      .neq("id", 0);

    const csvRows = [];

    // 🔽 Download CSV from Supabase Storage
    const { data, error } = await supabase.storage
      .from("biometric-records") // bucket name
      .download("Fingerprint_scans2.csv"); // file name

    if (error) throw error;

    // 🔽 Convert Blob → Buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // 🔽 Parse CSV
    await new Promise((resolve, reject) => {
      Readable.from(buffer)
        .pipe(csv())
        .on("data", (row) => {
          csvRows.push({
            macid: row.macid,
            enrollment_no: Number(row.stud_enrollment),
            punch_time: row.punch_time,
            status: row.status,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (csvRows.length > 0) {
      const { error } = await supabase
        .from("fingerprint_scans")
        .insert(csvRows);

      if (error) throw error;
    }

    /* --------------------------------------------------
       2️⃣ PROCESS → fingerprint_scans_revised
    -------------------------------------------------- */
    const { data: scans, error: scanError } = await supabase
      .from("fingerprint_scans")
      .select("*");

    if (scanError) throw scanError;

    console.log("Total scans:", scans.length);

    const seen = new Set();
    const revisedRows = [];

    scans
      .filter(r => r.status && r.status.toString().trim().toLowerCase() === "success")
      .forEach(r => {
        if (!seen.has(r.enrollment_no)) {
          seen.add(r.enrollment_no);
          revisedRows.push({
            macid: r.macid,
            enrollment_no: r.enrollment_no,
            punch_time: r.punch_time,
            status: r.status,
          });
        }
      });

    console.log("Rows to insert into revised:", revisedRows.length);

    // Clear old data first
    await supabase
      .from("fingerprint_scans_revised")
      .delete()
      .neq("id", 0);

    if (revisedRows.length > 0) {
      const { error } = await supabase
        .from("fingerprint_scans_revised")
        .insert(revisedRows);

      if (error) {
        console.error("❌ Insert error:", error);
        throw error;
      }
    }

    /* --------------------------------------------------
       3️⃣ GENERATE attendance_records
    -------------------------------------------------- */
    await supabase
      .from("attendance_records")
      .delete()
      .neq("id", 0);

    const { data: students, error: studentError } = await supabase
      .from("students")
      .select("enrollment_no, name, ph_no, course, dept, year, section")
      .eq("course", course)
      .eq("dept", dept)
      .eq("year", Number(year))
      .eq("section", section);

    if (studentError) throw studentError;

    const studentRows = students || [];

    if (studentRows.length === 0) {
      return res.json({
        summary: { totalStudents: 0, present: 0, absent: 0 },
        details: [],
      });
    }

    const { data: fingerprints, error: fpError } = await supabase
      .from("fingerprint_scans_revised")
      .select("enrollment_no, macid, punch_time, status");

    if (fpError) throw fpError;

    const fingerprintRows = fingerprints || [];
    const fingerprintMap = {};

    fingerprintRows.forEach(f => {
      fingerprintMap[f.enrollment_no] = f;
    });

    const attendanceRows = studentRows.map(s => {
      const f = fingerprintMap[s.enrollment_no];

      return {
        enrollment_no: s.enrollment_no,
        course: s.course,
        dept: s.dept,
        year: s.year,
        section: s.section,
        in_time: f ? f.punch_time : null,
        biometric_verified: f ? f.status : null,
        macid: f ? f.macid : null,
        class_date: null,
        final_present: f ? "P" : "A",
        marked_by_name: null,
      };
    });

    const { error: insertError } = await supabase
      .from("attendance_records")
      .insert(attendanceRows);

    if (insertError) throw insertError;

    /* --------------------------------------------------
       4️⃣ RESPONSE
    -------------------------------------------------- */
    const present = attendanceRows.filter(
      r => r.final_present === "P"
    ).length;

    res.json({
      summary: {
        totalStudents: attendanceRows.length,
        present,
        absent: attendanceRows.length - present,
      },
      details: studentRows.map(s => ({
        ...s,
        status: fingerprintMap[s.enrollment_no]
          ? "Present"
          : "Absent",
      })),
    });

  } catch (err) {
    console.error("🔥 /students error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 🔥 UPDATE ATTENDANCE (writes P / A)
// =====================================================
router.post("/update-attendance", async (req, res) => {
  try {
    const { updates, marked_by_name } = req.body;

    console.log("Incoming updates:", updates);
    console.log("Marked by:", marked_by_name);

    /* --------------------------------------------------
       1️⃣ Update attendance_records (P / A)
    -------------------------------------------------- */
    const updateRows = updates.map((s) => ({
      enrollment_no: s.enrollment_no,
      final_present: s.status === "Present" ? "P" : "A",
      marked_by_name,
    }));

    const { error: updateError } = await supabase
      .from("attendance_records")
      .upsert(updateRows, {
        onConflict: ["enrollment_no"],
      });

    if (updateError) throw updateError;

    /* --------------------------------------------------
       2️⃣ Fetch attendance_records (EXCLUDE id)
    -------------------------------------------------- */
    const { data: records, error: fetchError } = await supabase
      .from("attendance_records")
      .select(
        "enrollment_no, course, dept, year, section, class_date, " +
        "in_time, biometric_verified, macid, final_present, marked_by_name"
      );

    if (fetchError) throw fetchError;

    const attendanceRows = records || [];

    if (attendanceRows.length === 0) {
      return res.json({
        message: "No attendance records to archive",
      });
    }

    /* --------------------------------------------------
       3️⃣ Insert into attendance_records_revised
    -------------------------------------------------- */
    const archivedRows = attendanceRows.map(row => ({
      ...row,
      in_time: new Date().toISOString(), // current timestamp
    }));

    const { error: archiveError } = await supabase
      .from("attendance_records_revised")
      .insert(archivedRows);

    if (archiveError) throw archiveError;

    /* --------------------------------------------------
       4️⃣ Clear attendance_records (TEMP TABLE)
    -------------------------------------------------- */
    const { error: deleteError } = await supabase
      .from("attendance_records")
      .delete()
      .neq("id", 0);

    if (deleteError) throw deleteError;

    /* --------------------------------------------------
       5️⃣ FINAL RESPONSE
    -------------------------------------------------- */
    res.json({
      success: true,
      message: "Attendance finalized and archived permanently",
      records_archived: attendanceRows.length,
    });

  } catch (err) {
    console.error("🔥 /update-attendance error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 📘 GET FINALIZED ATTENDANCE
// =====================================================
router.get("/students/finalized", async (req, res) => {
  const { course, dept, year, section } = req.query;

  try {
    // 1️⃣ Get latest attendance timestamp for this class
    const { data: latest, error: latestError } = await supabase
      .from("attendance_records_revised")
      .select("in_time")
      .eq("course", course)
      .eq("dept", dept)
      .eq("year", Number(year))
      .eq("section", section)
      .order("in_time", { ascending: false })
      .limit(1)
      .single();

    if (latestError || !latest) {
      return res.json({
        summary: { totalStudents: 0, present: 0, absent: 0 },
        details: [],
      });
    }

    // 2️⃣ Fetch ONLY records from that latest session
    const { data, error } = await supabase
      .from("attendance_records_revised")
      .select(
        "enrollment_no, final_present"
      )
      .eq("course", course)
      .eq("dept", dept)
      .eq("year", Number(year))
      .eq("section", section)
      .eq("in_time", latest.in_time);

    if (error) throw error;

    const rows = data || [];

    const present = rows.filter(
      r => r.final_present === "P"
    ).length;

    res.json({
      summary: {
        totalStudents: rows.length,
        present,
        absent: rows.length - present,
      },
      details: rows.map(r => ({
        enrollment_no: r.enrollment_no,
        status: r.final_present === "P" ? "Present" : "Absent",
      })),
    });

  } catch (err) {
    console.error("🔥 finalized students error:", err);
    res.status(500).json({ error: err.message });
  }
});



// =====================================================
// 📊 CLASS DASHBOARD — TOTAL ATTENDANCE SUMMARY
// =====================================================
router.get("/attendance-summary", async (req, res) => {
  const { course, dept, year, section } = req.query;

  try {
    /* --------------------------------
       1️⃣ Fetch attendance records
    -------------------------------- */
    const { data, error } = await supabase
      .from("attendance_records_revised")
      .select("enrollment_no, final_present")
      .eq("course", course)
      .eq("dept", dept)
      .eq("year", Number(year))
      .eq("section", section);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.json({
        summary: {
          totalStudents: 0,
          totalPresent: 0,
          totalAbsent: 0,
          avgAttendance: 0,
          maxDaysPresent: 0,
        },
        students: [],
      });
    }

    /* --------------------------------
       2️⃣ Fetch student names
    -------------------------------- */
    const enrollmentNos = [
      ...new Set(data.map((r) => r.enrollment_no)),
    ];

    const { data: studentsData, error: studentsError } =
      await supabase
        .from("students")
        .select("enrollment_no, name")
        .in("enrollment_no", enrollmentNos);

    if (studentsError) throw studentsError;

    const nameMap = {};
    studentsData.forEach((s) => {
      nameMap[s.enrollment_no] = s.name;
    });

    /* --------------------------------
       3️⃣ Aggregate attendance
    -------------------------------- */
    const attendanceMap = {};

    data.forEach((row) => {
      const enr = row.enrollment_no;

      if (!attendanceMap[enr]) {
        attendanceMap[enr] = {
          enrollment_no: enr,
          name: nameMap[enr] || "Unknown",
          DaysPresent: 0,
          DaysAbsent: 0,
          TotalClasses: 0,
          Attendance: 0,
          Status: "Absent",
        };
      }

      attendanceMap[enr].TotalClasses += 1;

      if (row.final_present === "P") {
        attendanceMap[enr].DaysPresent += 1;
      } else {
        attendanceMap[enr].DaysAbsent += 1;
      }
    });

    /* --------------------------------
       4️⃣ Final per-student calculations
    -------------------------------- */
    const students = Object.values(attendanceMap).map((s) => {
      s.Attendance =
        s.TotalClasses === 0
          ? 0
          : Number(
              ((s.DaysPresent / s.TotalClasses) * 100).toFixed(1)
            );

      s.Status = s.Attendance >= 75 ? "Eligible" : "Short Attendance";
      return s;
    });

    /* --------------------------------
       5️⃣ Dashboard summary
    -------------------------------- */
    const totalStudents = students.length;
    const totalPresent = students.reduce(
      (sum, s) => sum + s.DaysPresent,
      0
    );
    const totalAbsent = students.reduce(
      (sum, s) => sum + s.DaysAbsent,
      0
    );
    const avgAttendance =
      totalStudents === 0
        ? 0
        : (
            students.reduce((sum, s) => sum + s.Attendance, 0) /
            totalStudents
          ).toFixed(1);

    const maxDaysPresent =
      totalStudents === 0
        ? 0
        : Math.max(...students.map((s) => s.DaysPresent));

    res.json({
      summary: {
        totalStudents,
        totalPresent,
        totalAbsent,
        avgAttendance,
        maxDaysPresent,
      },
      students,
    });
  } catch (err) {
    console.error("Attendance summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   GET ALL FACULTY (NO PASSWORD)
========================= */
router.get("/admin/faculty", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("facultyid, Name, email, status, phoneno")
      .order("facultyid", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      total: data.length,
      faculty: data,
    });
  } catch (err) {
    console.error("Admin faculty fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ADD FACULTY
========================= */
router.post("/admin/faculty", async (req, res) => {
  try {
    const { facultyid, Name, email, password, phoneno, status } = req.body;

    if (!facultyid || !Name || !email || !password) {
      return res.status(400).json({ error: "facultyid, Name, email and password are required" });
    }

    // 🔍 check duplicate facultyid
    const { data: existing } = await supabase
      .from("faculty")
      .select("facultyid")
      .eq("facultyid", facultyid)
      .single();

    if (existing) {
      return res.status(409).json({ error: "Faculty ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("faculty")
      .insert([
        {
          facultyid,
          Name,
          email,
          password: hashedPassword,
          phoneno,
          status: status || "Active",
        },
      ])
      .select("facultyid, Name, email, phoneno, status");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      faculty: data[0],
    });
  } catch (err) {
    console.error("Add faculty error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   UPDATE FACULTY
========================= */
router.put("/admin/faculty/:id", async (req, res) => {
  try {
    const facultyid = req.params.id;
    const { Name, email, password, phoneno, status } = req.body;

    const updateData = {
      Name,
      email,
      phoneno,
      status,
    };

    // update password ONLY if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
      .from("faculty")
      .update(updateData)
      .eq("facultyid", facultyid)
      .select("facultyid, Name, email, status, phoneno");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      faculty: data[0],
    });
  } catch (err) {
    console.error("Update faculty error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/admin/faculty/:id", async (req, res) => {
    try {
        const facultyid = req.params.id;

        const { error } = await supabase
            .from("faculty")
            .delete()
            .eq("facultyid", facultyid);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            message: "Faculty deleted successfully",
        });
    } catch (err) {
        console.error("Delete faculty error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/* =========================
   GET ALL STUDENTS
========================= */
router.get("/admin/students", async (req, res) => {
  try {
    const { course, dept, year, section } = req.query;

    if (!course || !dept || !year || !section) {
      return res.status(400).json({ error: "Missing filter parameters" });
    }

    const { data, error } = await supabase
      .from("students")
      .select("enrollment_no, name, ph_no, course, dept, year, section")
      .eq("course", course)
      .eq("dept", dept)
      .eq("year", year)
      .eq("section", section)
      .order("enrollment_no", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, students: data });
  } catch (err) {
    console.error("Filtered students fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* =========================
   ADD STUDENT
========================= */
router.post("/admin/students", async (req, res) => {
  try {
    const { enrollment_no, name, ph_no, course, dept, year, section } = req.body;

    if (!enrollment_no || !name || !course || !dept || !year || !section) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // check duplicate enrollment
    const { data: existing } = await supabase
      .from("students")
      .select("enrollment_no")
      .eq("enrollment_no", enrollment_no)
      .single();

    if (existing) {
      return res.status(409).json({ error: "Enrollment number already exists" });
    }

    const { data, error } = await supabase
      .from("students")
      .insert([
        { enrollment_no, name, ph_no, course, dept, year, section }
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, student: data[0] });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   UPDATE STUDENT
========================= */
router.put("/admin/students/:enrollment_no", async (req, res) => {
  try {
    const enrollment_no = req.params.enrollment_no;
    const { name, ph_no, course, dept, year, section } = req.body;

    const { data, error } = await supabase
      .from("students")
      .update({ name, ph_no, course, dept, year, section })
      .eq("enrollment_no", enrollment_no)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, student: data[0] });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   DELETE STUDENT
========================= */
router.delete("/admin/students/:enrollment_no", async (req, res) => {
  try {
    const enrollment_no = req.params.enrollment_no;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("enrollment_no", enrollment_no);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
