'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
    configure: function() {
        const credentials = {
            cloud_name: process.env.name,
            api_key: process.env.key,
            api_secret: process.env.secret
        };
        cloudinary.config(credentials);
    },

    getAllImages: async function() {
        const result = await cloudinary.v2.api.resources();
        return result.resources;
    },

    uploadImage: async function(file, name) {


       // console.log("Length in UploadImage" + imagefile.length);
      //  console.log("Filename in UploadImage" + filename);

      //  await writeFile('./public/images/TEMP.IMG', imagefile);
console.log(file);
console.log(name);
        console.log("in UploadImage and before upload file");
        await cloudinary.v2.uploader.upload("http://www.kerrycoco.ie/wp-content/uploads/2017/08/chambers.jpg",
            { public_id: "test"},
            function(error, result) {console.log(result, error); }

        );

        console.log("in UploadImage and after upload");

    },


    deleteImage: async function(id) {
        await cloudinary.v2.uploader.destroy(id, {});
    },

};

module.exports = ImageStore;