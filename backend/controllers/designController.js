const path = require("path");
const Design = require("../models/Design");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// -----------------------------------------------------------------------
// Call Flask Pix2Pix GAN microservice
// Flask endpoint:
// POST http://localhost:5000/predict
// Expected field: "file"
// Response:
// { image: "data:image/jpeg;base64,..." }
// -----------------------------------------------------------------------

async function callFlaskGAN(sketchPath, generatedFilename) {
  if (!process.env.FLASK_SERVICE_URL) {
    throw new Error("FLASK_SERVICE_URL is not configured");
  }

  const form = new FormData();

  // IMPORTANT:
  // Flask expects the field name "file", not "image".
  form.append("file", fs.createReadStream(sketchPath));

  const response = await axios.post(
    `${process.env.FLASK_SERVICE_URL}/predict`,
    form,
    {
      headers: form.getHeaders(),

      // GAN inference can take some time.
      timeout: 120000,

      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    },
  );

  if (!response.data || !response.data.image) {
    throw new Error("Flask returned no generated image");
  }

  const base64Image = response.data.image;

  // Flask returns:
  // data:image/jpeg;base64,<actual-base64-data>
  const matches = base64Image.match(
    /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/,
  );

  if (!matches) {
    throw new Error("Invalid image format returned by Flask");
  }

  const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
  const imageData = matches[2];

  // Save generated image in the same uploads directory
  // used by the existing application.
  const uploadsDir = path.join(__dirname, "..", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const generatedFile = `${generatedFilename}.${extension}`;
  const generatedPath = path.join(uploadsDir, generatedFile);

  fs.writeFileSync(generatedPath, Buffer.from(imageData, "base64"));

  // This is the URL/path stored in MongoDB.
  return `/uploads/${generatedFile}`;
}

// -----------------------------------------------------------------------

// @route POST /api/design
// @desc  Upload a new sketch and generate its 3D gold render
exports.createDesign = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a sketch image",
      });
    }

    // The actual file saved by multer.
    //
    // req.file.path is preferred because multer gives us the
    // real filesystem path.
    const sketchFilePath =
      req.file.path || path.join(__dirname, "..", "uploads", req.file.filename);

    // URL/path used by the frontend.
    const sketchImage = `/uploads/${req.file.filename}`;

    // Create design first so it exists in history with "processing".
    const design = await Design.create({
      user: req.user.id,
      title: req.body.title || "Untitled Design",
      sketchImage,
      status: "processing",
    });

    try {
      // Generate a unique filename for the AI output.
      const generatedFilename = `generated-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      // Send sketch → Flask → receive base64 → save generated image.
      const generatedImage = await callFlaskGAN(
        sketchFilePath,
        generatedFilename,
      );

      // Update design with generated result.
      design.generatedImage = generatedImage;
      design.status = "completed";

      await design.save();

      return res.status(201).json({
        design,
      });
    } catch (generationError) {
      console.error("Flask GAN generation failed:", generationError.message);

      // Keep the design in history but mark generation as failed.
      design.status = "failed";
      await design.save();

      return res.status(502).json({
        message: "AI image generation failed",
        error: generationError.message,
        design,
      });
    }
  } catch (err) {
    console.error("Create design error:", err);

    return res.status(500).json({
      message: "Server error creating design",
      error: err.message,
    });
  }
};

// @route GET /api/design
// @desc  Get all designs for the logged-in user (History page)
exports.getMyDesigns = async (req, res) => {
  try {
    const designs = await Design.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({ designs });
  } catch (err) {
    res.status(500).json({
      message: "Server error fetching designs",
      error: err.message,
    });
  }
};

// @route GET /api/design/:id
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!design) {
      return res.status(404).json({
        message: "Design not found",
      });
    }

    res.json({ design });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// @route DELETE /api/design/:id
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!design) {
      return res.status(404).json({
        message: "Design not found",
      });
    }

    res.json({
      message: "Design deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
