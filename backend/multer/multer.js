import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "./uploads/products";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const productStorage = multer.diskStorage({
  destination: uploadPath,

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `product-${Date.now()}${ext}`);
  },
});

const productFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed"),
      false
    );
  }
};

export const productMulter = multer({
  storage: productStorage,
  fileFilter: productFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});