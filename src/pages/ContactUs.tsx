import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({}); // ✅ Error state

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error on field change
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const validate = (): Partial<ContactForm> => {
    const newErrors: Partial<ContactForm> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    // if (!form.message.trim()) {
    //   newErrors.message = "Message is required";
    // }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // ✅ Set errors
      return;
    }

    const payload = {
      action: "add_message",
      ...form,
    };

    try {
      const res = await fetch("https://cric-india.com/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message added");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Message not submitted");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h2 className="text-[20px] font-bold text-center text-gray-600 mb-4">
        Contact Us
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Have questions or feedback? We'd love to hear from you!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg text-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg text-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600`}
              placeholder="Email@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`w-full border ${
                errors.message ? "border-red-500" : "border-gray-300"
              } text-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600`}
              placeholder="Message"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Send Message
          </button>
        </form>

        {/* Right: Contact Details */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-md flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">
            Get in Touch
          </h3>
          <p className="mb-4 text-gray-700">
            Whether you have a question about features, partnerships, or just
            want to say hello — we’d love to hear from you.
          </p>

          <div className="text-gray-800 space-y-4">
            <p>
              📧 Email:{" "}
              <a
                href="mailto:cricindiamedia@gmail.com"
                className="text-blue-600 underline"
              >
                cricindiamedia@gmail.com
              </a>
            </p>
            <p>
              📞 Phone:{" "}
              <a href="tel:+919145892080" className="text-blue-600 underline">
                +91-9145892080
              </a>
            </p>
            {/* <p>
//               📍 Address: C-56, Vrindavan Marg, Shyam Nagar, Jaipur, India
//             </p> */}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" toastStyle={{ top: "50px" }}/>
    </div>
  );
};

export default ContactUs;
