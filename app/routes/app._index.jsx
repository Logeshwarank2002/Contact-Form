import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function IndexPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const app = useAppBridge();
  console.log("app: ", app);

  useEffect(() => {
    async function loadData() {
      try {
        const shop = app.config.shop;
        console.log("shop: ", shop);
        if (!shop) {
          console.error("Shop param missing");
          return;
        }
        const tokenRes = await fetch(`/api/access_token?shop=${shop}`);
        const { accessToken } = await tokenRes.json();
        const contactsRes = await fetch(`/api/contact?shop=${shop}&accessToken=${accessToken}`,
        );
        const data = await contactsRes.json();

        setSubmissions(data);
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <s-page heading="Contact Submissions">
      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#1e3a8a", color: "white" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Phone</th>
              <th style={{ padding: "10px" }}>Submitted at</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((contact, index) => (
              <tr
                key={contact.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f3f4f6" : "white",
                }}
              >
                <td style={{ padding: "10px" }}>{contact.name}</td>
                <td style={{ padding: "10px" }}>{contact.email}</td>
                <td style={{ padding: "10px" }}>{contact.phoneNumber}</td>
                <td style={{ padding: "10px" }}>
  {new Date(contact.submittedAt).toLocaleString()}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </s-page>
  );
}
