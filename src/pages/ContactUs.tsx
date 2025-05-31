import React, { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setForm({ name: "", email: "", message: "" }); // Reset form
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
       toast.success("message not submit");
    }
  };

  // const [form, setForm] = useState({ name: "", email: "", message: "" });

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert("Thank you for contacting us!");
  //   setForm({ name: "", email: "", message: "" });
  // };

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
            {/* <label className="block font-medium mb-1">Name</label> */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg text-gray-600  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Your name "
              required
            />
          </div>

          <div>
            {/* <label className="block font-medium mb-1 ">Email</label> */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Email@gmail.com"
              required
            />
          </div>

          <div>
            {/* <label className="block font-medium mb-1">Message</label> */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-600  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Message"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
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
              📍 Address: C-56, Vrindavan Marg, Shyam Nagar, Jaipur, India
            </p> */}
          </div>
        </div>
      </div>

       <ToastContainer toastStyle={{ top: "50px" }} />
    </div>
  );
};

export default ContactUs;
