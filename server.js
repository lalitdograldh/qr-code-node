require("dotenv").config();
const express = require("express");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.post("/generate/base64",async(req,res) =>{
    try{
        const { text } = req.body;

        if(!text){
            return res.status(400).json({ success :false,message:"Text is required"});
        }
        const base64Image = await qr.toDataURL(text);
        
        return res.json({
            success:true,
            qr:base64Image
        });
    }catch(error){
        return res.status(500).json({ success: false, error: err.message });
    }
});

// ========================================
// 2️⃣ API: Generate QR Code & Save as PNG
// ========================================
app.post("/generate/png", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    const fileName = `qr_${Date.now()}.png`;
    const filePath = path.join(__dirname, "qr_images", fileName);

    // Create folder if not exists
    if (!fs.existsSync(path.join(__dirname, "qr_images"))) {
      fs.mkdirSync(path.join(__dirname, "qr_images"));
    }

    // Generate and save QR code to PNG
    await qr.toFile(filePath, text);

    return res.json({
      success: true,
      message: "QR Code saved successfully",
      fileName,
      filePath
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Server Start
app.listen(process.env.PORT, () => {
  console.log(
     "Project URL: http://" + process.env.PROJECT_URL + ":" + process.env.PORT
  );
});