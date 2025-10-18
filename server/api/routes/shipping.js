const express = require("express");
const shiprocketService = require("../../services/shiprocketService");

const router = express.Router();

// Create Shiprocket order
router.post("/order", async (req, res) => {
  try {
    const orderData = req.body;
    const result = await shiprocketService.createOrder(orderData);
    res.json(result);
  } catch (error) {
    console.error("Shiprocket order error:", error.message);
    res.status(500).json({ error: "Failed to create Shiprocket order" });
  }
});

// Track Shiprocket order
router.get("/track/:shipmentId", async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const result = await shiprocketService.trackOrder(shipmentId);
    res.json(result);
  } catch (error) {
    console.error("Shiprocket tracking error:", error.message);
    res.status(500).json({ error: "Failed to track Shiprocket order" });
  }
});

// Download Shiprocket label
router.get("/label/:shipmentId", async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const pdfBuffer = await shiprocketService.getLabel(shipmentId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=label_${shipmentId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Shiprocket label error:", error.message);
    res.status(500).json({ error: "Failed to get Shiprocket label" });
  }
});

module.exports = router;
