const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = (path, folder) => {
  return cloudinary.v2.uploader
    .upload(path, { folder })
    .then((data) => {
      return { url: data.url, public_id: data.public_id };
    })
    .catch((err) => console.log(err));
};

async function removeFromCloudinary(public_id) {
  await cloudinary.v2.uploader.destroy(public_id, function (err, result) {
    console.log(err, result);
  });
}

module.exports = { uploadToCloudinary, removeFromCloudinary };
