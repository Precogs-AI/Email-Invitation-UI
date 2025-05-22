import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

() => {
  const [inviteType, setInviteType] = useState("email"); // Default is invite by email
  const [emails, setEmails] = useState("");
  const [orgId, setOrgId] = useState("");
  const [inviteLink, setInviteLink] = useState(""); // Store the generated invite link

  const handleInviteTypeChange = (type) => {
    setInviteType(type);
    setInviteLink(""); // Reset the invite link when switching invite types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (inviteType === "email") {
        // Send invite via email
        const response = await fetch(
          "http://localhost:4500/api/v1/create-invite",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userToken}` // Include user authentication token
            },
            body: JSON.stringify({
              orgId: validateOrgId(orgId), // Validate and sanitize orgId
              emails: emails.split(","), // Assuming emails are comma-separated
              isEmailRestricted: true,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success(`${data.message}`, {
            position: "top-center",
          });
        } else {
          toast.error(`Error: ${data.message}`, {
            position: "top-center",
          });
        }
      } else {
        // Generate invite link automatically and copy it to clipboard
        const response = await fetch(
          "http://localhost:4500/api/v1/create-invite",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userToken}` // Include user authentication token
            },
            body: JSON.stringify({
              orgId: validateOrgId(orgId), // Validate and sanitize orgId
              emails: [], // Empty for link invites
              isEmailRestricted: false,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setInviteLink(data.inviteLink); // Save the invite link to state

          // Automatically copy the link to clipboard
          navigator.clipboard.writeText(data.inviteLink);
          toast.success("Invite link generated and copied to clipboard!", {
            position: "top-center",
          });
        } else {
          toast.error(`Error: ${data.message}`, {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      toast.error("Error sending invite", {
        position: "top-center",
      });
    }
  };

  return (
    <div style={styles.container}>
      <Toaster />
      <div style={styles.formContainer}>
        <h1>Send Invite</h1>
        <div style={styles.switchContainer}>
          <button
            style={inviteType === "email" ? styles.activeButton : styles.button}
            onClick={() => handleInviteTypeChange("email")}
          >
            Invite by Email
          </button>
          <button
            style={inviteType === "link" ? styles.activeButton : styles.button}
            onClick={() => handleInviteTypeChange("link")}
          >
            Invite by Link
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Organization ID */}
          <div style={styles.inputGroup}>
            <label>Organization ID:</label>
            <input
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Conditional Rendering Based on Invite Type */}
          {inviteType === "email" && (
            <div style={styles.inputGroup}>
              <label>Emails (comma-separated):</label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                required
                rows="4"
                style={styles.textarea}
              />
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            {inviteType === "email"
              ? "Send Email Invites"
              : "Generate and Copy Invite Link"}
          </button>
        </form>

        {/* If invite link is generated, display it */}
        {inviteType === "link" && inviteLink && (
          <div style={styles.copyContainer}>
            <p style={styles.inviteLink}>Invite Link: {inviteLink}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  formContainer: {
    maxWidth: "600px",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },
  switchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    margin: "0 10px",
    cursor: "pointer",
    backgroundColor: "#ddd",
    border: "none",
    borderRadius: "4px",
  },
  activeButton: {
    padding: "10px 20px",
    margin: "0 10px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#4A90E2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  copyContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inviteLink: {
    marginBottom: "10px",
    wordWrap: "break-word",
    textAlign: "center",
  },
};

export default SendInvite;
