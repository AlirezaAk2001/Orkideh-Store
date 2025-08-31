import React, { useState } from "react";
import CryptoJS from "crypto-js";

function ImageUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadFile(file);
    }
  };

  const generateSignature = (timestamp) => {
    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;
    const uploadPreset = "my_unsigned";
    const toSign = `upload_preset=${uploadPreset}&timestamp=${timestamp}`;
    const signature = CryptoJS.HmacSHA1(toSign, apiSecret).toString();
    return signature;
  };

  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned");
    const timestamp = Math.floor(Date.now() / 1000);
    formData.append("timestamp", timestamp);
    formData.append("signature", generateSignature(timestamp));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dqxkp4ur2/image/upload");

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          onUpload(res.secure_url);
        } else {
          setError(`Upload failed! Status: ${xhr.status}, ${xhr.responseText}`);
        }
        setLoading(false);
        console.log("Response:", xhr.responseText);
      };

      xhr.onerror = () => {
        setError("Network error");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setError("Unexpected error");
      setLoading(false);
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 rounded-full object-cover border"
        />
      )}
      <label className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-xs sm:text-sm">
        Select Image
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </label>
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2">
          <div
            className="bg-blue-600 h-1 sm:h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
    </div>
  );
}

export default ImageUpload;