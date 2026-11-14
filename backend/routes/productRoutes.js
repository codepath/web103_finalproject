
import { Router } from "express";

const router = Router();

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function readNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

// Only accept explicit grams or milliliters.

function normalizeUnit(value) {
  const unit = String(value || "")
    .trim()
    .toLowerCase();

  if (unit === "g") return "g";
  if (unit === "ml") return "mL";

  return null;
}

// Read the serving size from Open Food Facts.
// Example: "1/4 cup (30 g)" becomes 30 g.

function getServing(product) {
  const text = String(product.serving_size || "");

  const normalizedAmount = readNumber(
    product.serving_quantity
  );

  const normalizedUnit = normalizeUnit(
    product.serving_quantity_unit
  );

  if (
    normalizedAmount > 0 &&
    normalizedUnit
  ) {
    return {
      amount: normalizedAmount,
      unit: normalizedUnit,
      label: text,
    };
  }

  const matches = [
    ...text.matchAll(
      /(\d+(?:[.,]\d+)?)\s*(g|ml)\b/gi
    ),
  ];

  // Don't guess when there are multiple
  // different weights or volumes.

  if (matches.length === 1) {
    const amount = Number(
      matches[0][1].replace(",", ".")
    );

    const unit = normalizeUnit(matches[0][2]);

    if (amount > 0 && unit) {
      return {
        amount,
        unit,
        label: text,
      };
    }
  }

  return {
    amount: null,
    unit: null,
    label: text,
  };
}

// Accept HTTPS images from Open Food Facts only.

function safeImage(value) {
  if (!value) return null;

  try {
    const url = new URL(value);

    const allowed = [
      "images.openfoodfacts.org",
      "static.openfoodfacts.org",
    ];

    if (
      url.protocol === "https:" &&
      allowed.includes(url.hostname)
    ) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

// ==========================================
// PRODUCT LOOKUP
// ==========================================

router.get("/:code", async (req, res, next) => {
  try {
    const code = String(req.params.code);

    // Support EAN-8, UPC, EAN-13 and GTIN-14.

    if (!/^(\d{8}|\d{12,14})$/.test(code)) {
      return res.status(400).json({
        error:
          "Enter an 8, 12, 13 or 14 digit barcode.",
      });
    }

    const fields = [
      "code",
      "product_name",
      "brands",
      "quantity",
      "image_front_url",
      "image_url",
      "serving_size",
      "serving_quantity",
      "serving_quantity_unit",
      "product_quantity_unit",
      "nutriments",
    ].join(",");

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${encodeURIComponent(fields)}`,
      {
        headers: {
          "User-Agent":
            "PrepWise-CodePath-Student-Project/3.1",
        },

        signal: AbortSignal.timeout(12000),
      }
    );

    if (response.status === 404) {
      return res.status(404).json({
        error:
          "Product not found. Check the barcode or add it manually.",
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        error:
          "Product database is unavailable. Try again.",
      });
    }

    const data = await response.json();

    const product = data.product;

    if (
      data.status !== 1 ||
      !product ||
      !product.product_name
    ) {
      return res.status(404).json({
        error: "No matching product found.",
      });
    }

    const nutrients = product.nutriments || {};

    const serving = getServing(product);

    const packageUnit = normalizeUnit(
      product.product_quantity_unit
    );

    // Conflicting units must be reviewed manually.

    const basisUnit =
      serving.unit &&
      packageUnit &&
      serving.unit !== packageUnit

        ? null

        : serving.unit || packageUnit || null;

    const imageUrl =
      safeImage(product.image_front_url) ||
      safeImage(product.image_url);

    res.json({
      code,

      name: product.product_name,

      brand: product.brands || "",

      package: product.quantity || "",

      image_url: imageUrl,

      serving,

      basis_unit: basisUnit,

      nutrition: {
        calories: readNumber(
          nutrients["energy-kcal_100g"]
        ),

        protein: readNumber(
          nutrients.proteins_100g
        ),

        carbs: readNumber(
          nutrients.carbohydrates_100g
        ),

        fat: readNumber(
          nutrients.fat_100g
        ),
      },

      source: `Open Food Facts barcode ${code}`,

      source_url:
        `https://world.openfoodfacts.org/product/${code}`,
    });

  } catch (error) {
    if (
      error.name === "TimeoutError" ||
      error.name === "AbortError"
    ) {
      return res.status(504).json({
        error:
          "Product lookup timed out. Try again.",
      });
    }

    next(error);
  }
});

export default router;
