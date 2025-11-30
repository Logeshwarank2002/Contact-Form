import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const app = useAppBridge();

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        // Replace with your API endpoint
        const response = await fetch(`http://localhost:3000/contact?shop=demo-visual-market.myshopify.com`);
        if (!response.ok) throw new Error("Failed to fetch submissions");

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        app.toast.show("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [app]);

  if (loading) return <p>Loading submissions...</p>;

  return (
    <s-page heading="Contact Form Submissions">
      {submissions.length === 0 ? (
        <s-paragraph>No submissions found for this shop.</s-paragraph>
      ) : (
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#1e3a8a", color: "white" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Message</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((contact, idx) => (
                  <tr
                    key={contact.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f3f4f6" : "white",
                      color: "#111827",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>{contact.name}</td>
                    <td style={{ padding: "0.75rem" }}>{contact.email}</td>
                    <td style={{ padding: "0.75rem" }}>{contact.phoneNumber}</td>
                    <td style={{ padding: "0.75rem" }}>{contact.message || "-"}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(contact.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </s-box>
        </s-stack>
      )}
    </s-page>
  );
}
