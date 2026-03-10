import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageCircle, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactCTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // You can customize this endpoint based on your backend
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        toast.success('Message sent! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-600/5 dark:bg-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center flex flex-col gap-4 mb-16">
          <h2 className="heading-md dark:text-white">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or need a custom quote? Contact us today and let's bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Phone */}
            <div className="glass-card p-6 flex gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600">
                <Phone size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold dark:text-white">Call Us</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
                  <a href="tel:+977-9860184030" className="hover:text-brand-600 transition-colors">
                    +977 9860184030
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card p-6 flex gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600">
                <Mail size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold dark:text-white">Email</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <a href="mailto:chhaapcreatives@gmail.com" className="hover:text-brand-600 transition-colors">
                    chhaapcreatives@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="glass-card p-6 flex gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600">
                <MapPin size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold dark:text-white">Location</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gokarneshwor-5, Jorpati<br />Kathmandu, Nepal
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/977-9860184030"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 flex gap-4 hover:border-brand-500/30 transition-all group"
            >
              <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                <MessageCircle size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold dark:text-white">WhatsApp</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Message us anytime</p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field py-2.5 text-sm"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field py-2.5 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field py-2.5 text-sm"
                  placeholder="+977 98XXXXXXXX"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input-field py-2.5 text-sm"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="input-field py-2.5 text-sm resize-none"
                  placeholder="Tell us more about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold uppercase text-sm rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Send = ({ size }) => <Mail size={size} />;

export default ContactCTA;
