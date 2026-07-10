import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { contactSchema, ContactFormData } from '@/validations/contact';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({name: '',email: '',message: '',});
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) throw new Error('Failed to submit message');
      return res.json();
    },
    onSuccess: () => {
      alert("Thanks, your msg sent successfully.");
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    },
    onError: (err: any) => {
      alert(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleChange= (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const {name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validData= contactSchema.parse(formData);
      mutation.mutate(validData);
    }catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<ContactFormData> = {};
        err.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData]= err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Contact Us</h1>
        <p className="text-slate-600 text-md">We are here to help. Send us a message.</p>
      </div>

      <div className="card p-7 max-w-2xl mx-auto">
        <form noValidate onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your name"
              required
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="email@example.com"
              required
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={7}
              className="w-full text-sm p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-y"
              placeholder="help text"
              required
            />
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary w-full py-2 text-sm font-medium disabled:opacity-70"
          >
            {mutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}