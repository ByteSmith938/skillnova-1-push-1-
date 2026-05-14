import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders } from "../services/apiConfig";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    college: "",
    phone: "",
    email: "",
    upiId: "",
    workshopId: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data by ID
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/student/${id}`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) {
          throw new Error("Student not found");
        }
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching student details");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/student/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      alert("Student updated successfully!");
      // Redirect back to the admin workshop detail page
      if (form.workshopId || form.selectedWorkshopId) {
        navigate(`/dashboard/workshop/${form.workshopId || form.selectedWorkshopId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Edit Student</h2>

        <p style={styles.subtext}>Student ID: {id}</p>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="college"
          placeholder="College"
          value={form.college}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="text"
          name="upiId"
          placeholder="UPI Transaction ID"
          value={form.upiId}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <br /><br />

        <button type="submit" style={styles.button}>
          Save Changes
        </button>
        
        <button 
          type="button" 
          onClick={() => (form.workshopId || form.selectedWorkshopId) ? navigate(`/dashboard/workshop/${form.workshopId || form.selectedWorkshopId}`) : navigate(-1)} 
          style={{...styles.button, background: "#ccc", marginTop: "10px", color: "black"}}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}

export default EditStudent;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f9fafb"
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  title: {
    marginBottom: "10px",
    color: "#333"
  },

  subtext: {
    fontSize: "12px",
    marginBottom: "20px",
    color: "gray"
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "25px",
    border: "none",
    background: "#007BFF",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
