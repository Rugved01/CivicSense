// Free image upload using ImgBB API
// Get your API key from: https://imgbb.com/
// Replace the key below with your actual API key

const IMGBB_API_KEY = "11479899230d3f290d49d9913cd24096";

export async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image must be less than 5MB"));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error("Only image files are allowed"));
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resolve(data.data.url);
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}