import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function IndexPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const app = useAppBridge();

  useEffect(() => {
    async function loadData() {
      try {
        const shop = app.config.shop;
        if (!shop) {
          console.error("Shop param missing");
          return;
        }
        const tokenRes = await fetch(`/api/access_token?shop=${shop}`);
        const { accessToken } = await tokenRes.json();
        const contactsRes = await fetch(
          `/api/contact?shop=${shop}&accessToken=${accessToken}`
        );
        const data = await contactsRes.json();

        setSubmissions(data.data || []);
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [app]);

  const openMessagesModal = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  return (
    <div className="page-container">
  <div className="content-wrapper">
    <h1 className="page-title">Contact Submissions</h1>

    {loading ? (
      <div className="loading">Loading...</div>
    ) : submissions.length === 0 ? (
      <div className="card">No submissions found.</div>
    ) : (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Submitted At</th>
              <th>Messages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((contact, idx) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phoneNumber}</td>
                <td>{new Date(contact.submittedAt).toLocaleString()}</td>
                <td>
                  <span className={contact.messages?.length ? "badge badge-green" : "badge badge-gray"}>
                    {contact.messages?.length || 0}
                  </span>
                </td>
                <td>
                  <button className="button" onClick={() => openMessagesModal(contact)}>
                    View Messages
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

  {/* Modal */}
  {showModal && selectedContact && (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{selectedContact.name}</h2>
            <p>{selectedContact.email}</p>
          </div>
          <button onClick={closeModal}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="modal-content">
          {selectedContact.messages?.length === 0 ? (
            <div className="text-center">No messages yet.</div>
          ) : (
            selectedContact.messages.map(msg => (
              <div key={msg.id} className="message-card">
                <div className="message-header">
                  <span>Message</span>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="message-content">{msg.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}