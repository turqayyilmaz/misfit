const { dirname, resolve } = require('path');
const appDir = dirname(require.main.filename);

exports.uploadImage = async (req, fileName, folder) => {
  console.log("uploadimage:",req.files)
  return new Promise((resolve, reject) => {
    if (req.files) {
      const uploadedUrl = `/uploads/${folder}`;
      const uploadImage = req.files[fileName];
      const imagePath = `${appDir}\\public\\uploads\\${folder}\\${uploadImage.name}`;
      //appDir + '\\public\\uploads\\'+portfolios+\\' + uploadImage.name;
      const imageUrl = `${uploadedUrl}/${uploadImage.name}`;
      uploadImage.mv(imagePath.toString(), async (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(imageUrl);
        }
      });
    } else {
      resolve('');
    }
  });
};
