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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Contact Submissions
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No submissions found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Submitted At
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Messages
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(contact.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${contact.messages && contact.messages.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {contact.messages ? contact.messages.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => openMessagesModal(contact)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
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

      {/* Messages Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedContact.name}</h2>
                <p className="text-blue-100 text-sm">{selectedContact.email}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-blue-800 rounded-lg p-1 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Content */}
            <div className="p-6">
              {!selectedContact.messages || selectedContact.messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedContact.messages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Message
                        </span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}