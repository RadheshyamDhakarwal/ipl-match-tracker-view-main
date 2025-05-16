import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const NewsForm = ({ fetchNews }) => {
  const [form, setForm] = useState({
    newsTitle: "",
    shortDescription: "",
    longDescription: "",
    metaTitle: "",
    metaDescription: "",
    baseValue: "",
    slugValue: "",
    status: "draft",
    image: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      setForm((prevForm) => ({
        ...prevForm,
        image: file, // keep the actual File object
        imageName: file.name, // store the name only: "weblogo.jpg"
      }));
    }
    // If the user is editing the newsTitle, also update the slugValue
    if (name === "newsTitle") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^a-z0-9\-]/g, "") // Remove invalid characters
        .replace(/\-{2,}/g, "-") // Replace multiple - with single -
        .replace(/^\-+|\-+$/g, ""); // Trim - from start and end

      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        slugValue: generatedSlug,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("http://localhost:5500/api/create-news", form);
  //     toast.success("News submitted successfully!");
  //     setForm({
  //       newsTitle: "",
  //       shortDescription: "",
  //       longDescription: "",
  //       metaTitle: "",
  //       metaDescription: "",
  //       baseValue: "",
  //       slugValue: "",
  //       status: "draft",
  //       image: "",
  //       date: new Date().toISOString().slice(0, 10),
  //     });
  //     fetchNews(); // Refresh list
  //   } catch (error) {
  //     toast.error("Error submitting news. Please try again.");
  //     console.error("Error submitting news:", error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();
  //     for (const key in form) {
  //       formData.append(key, form[key]);
  //     }

  //     await axios.post("http://localhost:5500/api/create-news", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     toast.success("News submitted successfully!");
  //     setForm({
  //       newsTitle: "",
  //       shortDescription: "",
  //       longDescription: "",
  //       metaTitle: "",
  //       metaDescription: "",
  //       baseValue: "",
  //       slugValue: "",
  //       status: "draft",
  //       image: "",
  //       date: new Date().toISOString().slice(0, 10),
  //     });

  //     fetchNews();
  //   } catch (error) {
  //     toast.error("Error submitting news.");
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("newsTitle", form.newsTitle);
    formData.append("shortDescription", form.shortDescription);
    formData.append("longDescription", form.longDescription);
    formData.append("metaTitle", form.metaTitle);
    formData.append("metaDescription", form.metaDescription);
    formData.append("baseValue", form.baseValue);
    formData.append("slugValue", form.slugValue);
    formData.append("status", form.status);
    formData.append("date", form.date);
    formData.append("image", form.image); // ✅ add the actual file
    try {
      await axios.post("http://localhost:5500/api/create-news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("News submitted successfully!");
      setForm({
        newsTitle: "",
        shortDescription: "",
        longDescription: "",
        metaTitle: "",
        metaDescription: "",
        baseValue: "",
        slugValue: "",
        status: "draft",
        image: null,
        date: new Date().toISOString().slice(0, 10),
      });

      fetchNews();
    } catch (error) {
      toast.error("Error submitting news. Please try again.");
      console.error("Error submitting news:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-600 dark:text-gray-100 ">
        Add News
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="newsTitle"
          className="form-control p-2 border rounded"
          placeholder="News Title"
          value={form.newsTitle}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="shortDescription"
          className="form-control p-2 border rounded"
          placeholder="Short Description"
          value={form.shortDescription}
          onChange={handleChange}
        />

        {/* <textarea
          name="longDescription"
          className="form-control p-2 border rounded h-28"
          placeholder="Long Description"
          value={form.longDescription}
          onChange={handleChange}
        /> */}

        <CKEditor
          editor={ClassicEditor}
          data={form.longDescription}
          onChange={(event, editor) => {
            const rawHtml = editor.getData();
            const plainText = stripHtml(rawHtml);
            setForm((prevForm) => ({
              ...prevForm,
              longDescription: plainText,
            }));
          }}
        />

        <input
          type="text"
          name="metaTitle"
          className="form-control p-2 border rounded"
          placeholder="Meta Title"
          value={form.metaTitle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="metaDescription"
          className="form-control p-2 border rounded"
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={handleChange}
        />

        <input
          type="text"
          name="baseValue"
          className="form-control p-2 border rounded"
          placeholder="Base Value"
          value={form.baseValue}
          onChange={handleChange}
        />

        <input
          type="text"
          name="slugValue"
          className="form-control p-2 border rounded"
          placeholder="Slug Value"
          value={form.slugValue}
          onChange={handleChange}
          readOnly
        />

        <select
          name="status"
          className="form-select p-2 border rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="draft"></option>
          <option value="published">Published</option>
        </select>

        <input
          type="date"
          name="date"
          className="form-control p-2 border rounded"
          value={form.date}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="form-control p-2 border rounded"
          onChange={handleChange} // You’ll define this handler
        />

        <button
          type="submit"
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Add News
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewsForm;
