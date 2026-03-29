import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, Mail } from "lucide-react";
import { API_URL } from "../../services/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5ECEF] dark:bg-slate-950 py-12 px-4 transition-colors">
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-800 dark:text-white hover:scale-110 transition-transform z-50">
        <ArrowLeft size={24} />
      </Link>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 md:p-12 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95 mb-4">
            <img src="/images/logo.png" alt="Muscle Map" className="h-14 w-auto drop-shadow-sm" />
          </Link>
          <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">Contact Us</h1>
          <p className="text-sm text-slate-500 mt-2">We're here to help with any questions or issues.</p>
        </div>

        <div className="mb-10">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 text-center border border-slate-100 dark:border-slate-800">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
            <a href="mailto:musclemap@yahoo.com" className="text-sm font-bold text-[#1b3061] dark:text-blue-400 hover:underline">musclemap@yahoo.com</a>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Message Sent!</h2>
            <p className="text-slate-500 dark:text-slate-400">Thank you for reaching out. We'll get back to you within 1-2 business days.</p>
            <Link to="/" className="inline-block mt-8 bg-[#274690] hover:bg-[#1f3770] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
              <select
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
              >
                <option value="">Select a topic...</option>
                <option value="billing">Billing & Premium</option>
                <option value="refund">Refund Request</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="account">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm resize-none"
                placeholder="Describe your issue or question..."
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#274690] hover:bg-[#1f3770] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
