import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../src/context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does domestic shipping take?',
      a: 'Standard courier delivery arrives within 2 to 4 business days. Priority Air Overnight delivery options are selectable during checkout.'
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We offer 30-day risk-free returns on all non-custom products. Simply initiate a return from your Account dashboard or email support@aura-artifact.store for a prepaid shipping label.'
    },
    {
      q: 'How do product color variations work?',
      a: 'Every color variation is matched with its own high-resolution studio photography and tracked with individual SKU inventory so you receive the exact finish and hue you selected.'
    },
    {
      q: 'Is Stripe test payment safe to use?',
      a: 'Yes, all checkout transactions in this deployment run via Stripe test encryption. No real money is charged, and real test credentials allow full verification of checkout and order tracking.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your inquiry has been submitted! Our concierge team will reply within 24 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 text-left">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">Customer Care & Concierge</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          We are here to assist.
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have questions regarding an order, materials, or bespoke corporate gifting? Contact our studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-slate-900">Message Received</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thank you, {name}. A member of our concierge team will respond to <strong>{email}</strong> within one business day.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Julian Hayes"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="julian@example.com"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Order inquiry, craftsmanship question, or feedback"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How may our studio assist your daily rituals?"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Studio Info & FAQ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF9F5] p-6 rounded-3xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">Studio Coordinates</h3>
            
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Flagship Showroom</strong>
                  <span>742 Evergreen Atelier, Soho, New York, NY 10012</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Concierge Hours</strong>
                  <span>Monday – Friday: 9:00 AM – 6:00 PM EST</span>
                  <span className="block text-stone-400">Weekend email support available</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Telephone</strong>
                  <span>+1 (800) 492-0192</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
            <h3 className="font-serif font-bold text-lg text-slate-900">Frequently Asked Questions</h3>
            <div className="divide-y divide-stone-100 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-2.5">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left font-semibold text-slate-900 flex justify-between items-center py-1 hover:text-amber-800 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-stone-500 pt-1 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
