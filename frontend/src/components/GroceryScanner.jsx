
import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";

// ==========================================
// SETTINGS
// ==========================================

const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pieces",
];

const MACROS = [
  ["calories", "Calories", "kcal"],
  ["protein", "Protein", "g"],
  ["carbs", "Carbs", "g"],
  ["fat", "Fat", "g"],
];

let rowSequence = 0;

// ==========================================
// HELPERS
// ==========================================

function round(value) {
  return Math.round(
    (Number(value) + Number.EPSILON) * 100
  ) / 100;
}

function format(value) {
  if (value == null) return "—";

  return round(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function validPositive(value) {
  return (
    Number.isFinite(Number(value)) &&
    Number(value) > 0 &&
    Number(value) <= 100000
  );
}

function rowFor(name) {
  return {
    id: ++rowSequence,
    name,
    quantity: "1",
    unit: "pieces",
    category: "Other",
    expiration_date: "",
    status: "",
  };
}

function cameraSupported() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.BarcodeDetector) &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    window.isSecureContext
  );
}

// Convert uploaded photos to smaller JPEGs
// before sending them to Gemini.

async function photoData(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Choose an image.");
  }

  if (file.size > 20 * 1024 * 1024) {
    throw new Error(
      "Choose an image smaller than 20 MB."
    );
  }

  const url = URL.createObjectURL(file);

  try {
    const image = new Image();

    image.src = url;

    await image.decode();

    const scale = Math.min(
      1,
      1200 / Math.max(image.width, image.height)
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(image.width * scale)
    );

    canvas.height = Math.max(
      1,
      Math.round(image.height * scale)
    );

    const context = canvas.getContext("2d");

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL(
      "image/jpeg",
      0.78
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function Card({ title, children }) {
  return (
    <section className="pw-kitchen-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="pw-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

// ==========================================
// LIVE BARCODE CAMERA
// ==========================================

function LiveCamera({
  onDetected,
  onClose,
}) {
  const videoRef = useRef(null);

  const callbackRef = useRef(onDetected);

  const [error, setError] = useState("");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    callbackRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    let active = true;
    let stream = null;
    let timer = null;

    function stopCamera() {
      if (timer !== null) {
        clearTimeout(timer);
      }

      stream?.getTracks().forEach(
        (track) => track.stop()
      );
    }

    async function startCamera() {
      try {
        if (!cameraSupported()) {
          throw new Error(
            "Live barcode scanning is not supported by this browser."
          );
        }

        const detector = new window.BarcodeDetector();

        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,

          video: {
            facingMode: {
              ideal: "environment",
            },

            width: { ideal: 1280 },

            height: { ideal: 720 },
          },
        });

        // Handle closing the camera while permission
        // is still being requested.

        if (!active) {
          stopCamera();
          return;
        }

        const video = videoRef.current;

        if (!video) {
          stopCamera();
          return;
        }

        video.srcObject = stream;

        await video.play();

        if (!active) {
          stopCamera();
          return;
        }

        setReady(true);

        async function detectBarcode() {
          if (!active) return;

          try {
            if (video.readyState >= 2) {
              const results = await detector.detect(
                video
              );

              if (!active) return;

              const result = results.find(
                (item) =>
                  /^(\d{8}|\d{12,14})$/.test(
                    item.rawValue || ""
                  )
              );

              if (result) {
                active = false;

                stopCamera();

                callbackRef.current(
                  result.rawValue
                );

                return;
              }
            }

            if (active) {
              timer = setTimeout(
                detectBarcode,
                250
              );
            }
          } catch {
            if (active) {
              setError(
                "Camera detection stopped. Try a barcode photo or manual entry."
              );

              stopCamera();
            }
          }
        }

        detectBarcode();
      } catch (err) {
        if (!active) return;

        setError(
          err.name === "NotAllowedError"

            ? "Camera access was denied. Allow permission or enter the barcode manually."

            : err.name === "NotFoundError"

              ? "No camera was detected."

              : err.message
        );

        stopCamera();
      }
    }

    startCamera();

    // Turn off the camera when the user
    // closes the scanner or leaves the page.

    return () => {
      active = false;
      stopCamera();
    };
  }, []);

  return (
    <div
      style={{
        marginTop: 15,
        padding: 12,
        border: "1px solid #c8553d",
        borderRadius: 12,
      }}
    >
      <div
        className="pw-actions"
        style={{
          justifyContent: "space-between",
          marginTop: 0,
        }}
      >
        <strong>📷 Live Barcode Scanner</strong>

        <button
          type="button"
          className="btn"
          onClick={onClose}
        >
          Close camera
        </button>
      </div>

      {error ? (
        <p className="pw-notice pw-error">
          {error}
        </p>
      ) : (
        <p className="muted" role="status">
          {ready
            ? "Hold the barcode inside the camera frame."
            : "Starting camera…"}
        </p>
      )}

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 10,
          background: "#171717",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={{
            display: "block",
            width: "100%",
            maxHeight: 260,
            objectFit: "contain",
          }}
        />

        {ready && !error && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "28% 12%",
              border: "2px solid #7bdc81",
              borderRadius: 10,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ==========================================
// MAIN GROCERY SCANNER
// ==========================================

export default function GroceryScanner({
  active,
  busy,
  run,
  setError,
  setNotice,
  onNutrition,
}) {
  const [photo, setPhoto] = useState(null);

  const [barcode, setBarcode] = useState("");

  const [product, setProduct] = useState(null);

  const [scanRows, setScanRows] = useState([]);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [basisUnit, setBasisUnit] =
    useState("");

  const [portionMode, setPortionMode] =
    useState("100");

  const [customAmount, setCustomAmount] =
    useState("100");

  const [verified, setVerified] =
    useState(false);

  const [imageFailed, setImageFailed] =
    useState(false);

  // Stop the camera when leaving the scanner tab.

  useEffect(() => {
    if (!active) {
      setCameraOpen(false);
    }
  }, [active]);

  // ========================================
  // AI GROCERY PHOTO
  // ========================================

  function scanPhoto() {
    run(async () => {
      if (!photo) {
        throw new Error(
          "Choose a grocery photo first."
        );
      }

      const image = await photoData(photo);

      const { items } = await api.post(
        "/kitchen/scan",
        { image }
      );

      setScanRows((previous) => [
        ...previous,
        ...items.map(rowFor),
      ]);

      setNotice(
        items.length
          ? `${items.length} groceries identified. Review their quantities before adding.`

          : "No groceries were recognized. Try another photo."
      );
    });
  }

  // ========================================
  // BARCODE PRODUCT LOOKUP
  // ========================================

  function lookup(code = barcode) {
    const cleaned = String(code).trim();

    if (!/^(\d{8}|\d{12,14})$/.test(cleaned)) {
      setError(
        "Enter an 8, 12, 13 or 14 digit barcode."
      );

      return;
    }

    setCameraOpen(false);

    run(async () => {
      setProduct(null);
      setVerified(false);
      setImageFailed(false);

      const result = await api.get(
        `/kitchen/product/${encodeURIComponent(cleaned)}`
      );

      setProduct(result);

      setBarcode(cleaned);

      const unit =
        result.basis_unit ||
        "";

      setBasisUnit(unit);

      setCustomAmount("100");

      // Prefer one serving when a compatible
      // serving size is explicitly available.

      const hasServing =
        result.serving?.amount > 0 &&
        result.serving?.unit === unit;

      setPortionMode(
        hasServing ? "1" : "100"
      );

      setNotice(
        "Product found! Check the serving size and nutrition label."
      );
    });
  }

  // ========================================
  // BARCODE PHOTO RECOGNITION
  // ========================================

  async function readBarcode(file) {
    if (!file || busy) return;

    setError("");

    if (!window.BarcodeDetector) {
      setError(
        "Barcode photo recognition is not supported here. Type the barcode number instead."
      );

      return;
    }

    run(async () => {
      let bitmap;

      try {
        bitmap = await createImageBitmap(file);

        const detector =
          new window.BarcodeDetector();

        const results = await detector.detect(
          bitmap
        );

        const result = results.find(
          (item) =>
            /^(\d{8}|\d{12,14})$/.test(
              item.rawValue || ""
            )
        );

        if (!result) {
          throw new Error(
            "No grocery barcode detected. Try a clearer picture."
          );
        }

        // Look up the result after this action's
        // shared request lock has been released.

        setBarcode(result.rawValue);

        setNotice(
          "Barcode detected! Click Look up product."
        );
      } finally {
        bitmap?.close();
      }
    });
  }

  // ========================================
  // SERVING SIZE CALCULATIONS
  // ========================================

  const hasServing =
    Boolean(basisUnit) &&
    product?.serving?.amount > 0 &&
    product?.serving?.unit === basisUnit;

  let amount = 100;

  if (portionMode === "1" && hasServing) {
    amount = product.serving.amount;
  }

  if (portionMode === "2" && hasServing) {
    amount = product.serving.amount * 2;
  }

  if (portionMode === "custom") {
    amount = Number(customAmount);
  }

  const amountValid = validPositive(amount);

  const completeNutrition =
    product != null &&
    MACROS.every(
      ([key]) => product.nutrition[key] != null
    );

  function changeMode(value) {
    setPortionMode(value);

    setVerified(false);
  }

  function changeBasis(value) {
    setBasisUnit(value);

    setPortionMode("100");

    setVerified(false);
  }

  function scaledValue(key) {
    const value = product?.nutrition?.[key];

    if (
      value == null ||
      !basisUnit ||
      !amountValid
    ) {
      return null;
    }

    return round(
      Number(value) * amount / 100
    );
  }

  // ========================================
  // COPY PRODUCT INTO NUTRITION LOG
  // ========================================

  function copyNutrition() {
    if (
      !product ||
      !verified ||
      !basisUnit ||
      !amountValid ||
      !completeNutrition
    ) {
      return;
    }

    const suffix = ` (${format(amount)} ${basisUnit})`;

    const name = product.name.slice(
      0,
      150 - suffix.length
    );

    const values = Object.fromEntries(
      MACROS.map(([key]) => [
        key,
        String(scaledValue(key)),
      ])
    );

    onNutrition({
      label: `${name}${suffix}`,

      source:
        `${product.source}; verified ${amount} ${basisUnit}`,

      ...values,
    });
  }

  // ========================================
  // REVIEW PANTRY ADDITIONS
  // ========================================

  function addProductRow() {
    if (!product) return;

    setScanRows((previous) => [
      ...previous,

      rowFor(
        product.name.slice(0, 150)
      ),
    ]);

    setNotice(
      "Product added to review. Enter the actual pantry quantity."
    );
  }

  function editRow(id, key, value) {
    if (busy) return;

    setScanRows((previous) =>
      previous.map((row) =>
        row.id === id &&
        row.status !== "Added"

          ? {
              ...row,
              [key]: value,
              status: "",
            }

          : row
      )
    );
  }

  function saveScan(event) {
    event.preventDefault();

    run(async () => {
      let added = 0;
      let failed = 0;

      for (const row of scanRows) {
        if (row.status === "Added") continue;

        try {
          await api.post("/pantry-items", {
            name: row.name.trim(),

            quantity: Number(row.quantity),

            unit: row.unit,

            category:
              row.category.trim() || "Other",

            expiration_date:
              row.expiration_date || null,
          });

          added++;

          setScanRows((previous) =>
            previous.map((item) =>
              item.id === row.id

                ? { ...item, status: "Added" }

                : item
            )
          );

        } catch (err) {
          failed++;

          setScanRows((previous) =>
            previous.map((item) =>
              item.id === row.id

                ? { ...item, status: err.message }

                : item
            )
          );
        }
      }

      setNotice(
        `${added} added. ${failed} not added. Review any errors before retrying.`
      );
    });
  }

  // ========================================
  // SCANNER INTERFACE
  // ========================================

  return (
    <div>

      <div className="pw-kitchen-grid">

        {/* AI GROCERY PHOTO SCANNER */}

        <Card title="📸 AI Grocery Photo">

          <p>
            Choose a photo of your groceries.
            Gemini identifies the food items,
            and you review them before saving.
          </p>

          <Field label="Grocery image">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={busy}
              onChange={(event) =>
                setPhoto(
                  event.target.files?.[0] || null
                )
              }
            />
          </Field>

          <button
            type="button"
            className="pw-primary"
            disabled={busy || !photo}
            onClick={scanPhoto}
          >
            {busy
              ? "Processing…"
              : "Identify groceries"}
          </button>

        </Card>

        {/* BARCODE SCANNER */}

        <Card title="🔎 Barcode Scanner">

          <p>
            Scan with your camera, upload a barcode
            photo, or enter the printed number.
          </p>

          <button
            type="button"
            className="pw-primary"
            disabled={busy}
            onClick={() => {
              if (!cameraSupported()) {
                setError(
                  "Live barcode detection is unavailable in this browser. Use manual entry or a supported barcode photo scanner."
                );

                return;
              }

              setError("");

              setCameraOpen(
                (previous) => !previous
              );
            }}
          >
            {cameraOpen
              ? "Close live camera"
              : "📷 Open live camera"}
          </button>

          {active && cameraOpen && (
            <LiveCamera
              onDetected={(code) => {
                setCameraOpen(false);
                setBarcode(code);
                lookup(code);
              }}

              onClose={() =>
                setCameraOpen(false)
              }
            />
          )}

          <Field label="Barcode photo">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={busy}
              onChange={(event) =>
                readBarcode(
                  event.target.files?.[0]
                )
              }
            />
          </Field>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              lookup();
            }}
          >
            <Field label="Barcode number">
              <input
                value={barcode}
                inputMode="numeric"
                pattern="[0-9]{8}|[0-9]{12,14}"
                maxLength={14}
                placeholder="Enter product barcode"
                required
                disabled={busy}
                onChange={(event) =>
                  setBarcode(
                    event.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />
            </Field>

            <button
              type="submit"
              className="pw-primary"
              disabled={busy}
            >
              Look up product
            </button>
          </form>

        </Card>

      </div>

      {/* PRODUCT DETAILS */}

      {product && (
        <Card title={product.name}>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 20,
            }}
          >

            {/* Product image */}

            {product.image_url && !imageFailed ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                onError={() =>
                  setImageFailed(true)
                }
                style={{
                  width: 130,
                  height: 150,
                  objectFit: "contain",
                  background: "#fff",
                  borderRadius: 12,
                  padding: 10,
                }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: 120,
                  height: 130,
                  display: "grid",
                  placeItems: "center",
                  background: "var(--bg)",
                  borderRadius: 12,
                  fontSize: 55,
                }}
              >
                🛒
              </div>
            )}

            <div style={{ flex: "1 1 200px" }}>

              <strong>
                {product.brand || "Brand not recorded"}
              </strong>

              <p className="muted">
                {product.package &&
                  `Package: ${product.package}`}
              </p>

              <p>
                Barcode: {product.code}
              </p>

              <p>
                <strong>Serving size: </strong>

                {product.serving?.label ||

                  (
                    product.serving?.amount
                      ? `${format(product.serving.amount)} ${product.serving.unit}`
                      : "Not recorded"
                  )}
              </p>

              <a
                href={product.source_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--brand)",
                  fontSize: 12,
                }}
              >
                View product on Open Food Facts ↗
              </a>

            </div>

          </div>

          {/* MEASUREMENT BASIS */}

          <Field label="Nutrition measurement basis">
            <select
              value={basisUnit}
              onChange={(event) =>
                changeBasis(event.target.value)
              }
              disabled={busy}
            >
              <option value="">
                Choose the unit printed on the label
              </option>

              <option value="g">
                Per 100 grams (g)
              </option>

              <option value="mL">
                Per 100 milliliters (mL)
              </option>
            </select>
          </Field>

          <p className="muted">
            Confirm whether the database values
            are based on weight or volume.
            Grams and milliliters are not interchangeable.
          </p>

          {/* SERVING SIZE SELECTOR */}

          <Field label="How much did you eat or drink?">
            <select
              value={portionMode}
              disabled={busy}
              onChange={(event) =>
                changeMode(event.target.value)
              }
            >

              {hasServing && (
                <>
                  <option value="1">
                    1 serving
                    {" "}
                    ({format(product.serving.amount)}
                    {" "}
                    {basisUnit})
                  </option>

                  <option value="2">
                    2 servings
                    {" "}
                    ({format(product.serving.amount * 2)}
                    {" "}
                    {basisUnit})
                  </option>
                </>
              )}

              <option value="100">
                Per 100 {basisUnit || "g / mL"}
              </option>

              <option value="custom">
                Custom amount
              </option>

            </select>
          </Field>

          {portionMode === "custom" && (
            <Field
              label={`Amount consumed (${basisUnit || "g or mL"})`}
            >
              <input
                type="number"
                min="0.01"
                max="100000"
                step="0.01"
                value={customAmount}
                onChange={(event) => {
                  setCustomAmount(
                    event.target.value
                  );

                  setVerified(false);
                }}
              />
            </Field>
          )}

          {/* NUTRITION PREVIEW */}

          <h3 style={{ marginTop: 22 }}>
            Nutrition for your selected portion
          </h3>

          {basisUnit && amountValid && (
            <p className="muted">
              Showing nutrition for{" "}
              {format(amount)} {basisUnit}
            </p>
          )}

          <div className="pw-macro-grid">

            {MACROS.map(([key, label, unit]) => {
              const value = scaledValue(key);

              return (
                <div key={key}>

                  <span>{label}</span>

                  <strong>
                    {format(value)}
                    {value != null && ` ${unit}`}
                  </strong>

                </div>
              );
            })}

          </div>

          {/* NORMALIZED REFERENCE VALUES */}

          <details style={{ margin: "16px 0" }}>

            <summary style={{ cursor: "pointer" }}>
              View original database nutrition
            </summary>

            <p className="muted">
              Values per 100 {basisUnit || "g or mL"}
            </p>

            {MACROS.map(([key, label, unit]) => (
              <div
                className="pw-list"
                key={key}
              >
                <strong>{label}</strong>

                <span>
                  {format(product.nutrition[key])}

                  {product.nutrition[key] != null &&
                    ` ${unit}`}
                </span>
              </div>
            ))}

          </details>

          {!completeNutrition && (
            <p className="pw-notice pw-error">
              Some nutrition values are missing.
              Enter the package label values manually
              in the Nutrition tab.
            </p>
          )}

          {/* VERIFY BEFORE SAVING */}

          <label className="pw-check">
            <input
              type="checkbox"
              checked={verified}
              disabled={
                busy ||
                !basisUnit ||
                !amountValid ||
                !completeNutrition
              }
              onChange={(event) =>
                setVerified(
                  event.target.checked
                )
              }
            />

            I verified the nutrition values, serving
            size and measurement unit against the
            package label.
          </label>

          <div className="pw-actions">

            <button
              type="button"
              className="pw-primary"
              disabled={
                busy ||
                !verified ||
                !basisUnit ||
                !amountValid ||
                !completeNutrition
              }
              onClick={copyNutrition}
            >
              🥗 Use in nutrition log
            </button>

            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={addProductRow}
            >
              + Add product to pantry review
            </button>

          </div>

          <p
            className="muted"
            style={{
              fontSize: 12,
              marginTop: 12,
            }}
          >
            Nutrition is sourced from Open Food Facts
            and may contain incomplete or inaccurate
            information. Always check the package.
          </p>

        </Card>
      )}

      {/* REVIEW GROCERY ITEMS */}

      <Card title="Review Pantry Additions">

        <p>
          Confirm the actual quantity, measurement
          unit, category and expiration date before
          adding ingredients to your pantry.
        </p>

        <form onSubmit={saveScan}>

          {scanRows.length === 0 && (
            <p className="muted">
              No groceries to review yet.
              Scan a photo, look up a product,
              or add a row below.
            </p>
          )}

          {scanRows.map((row) => {
            const disabled =
              busy || row.status === "Added";

            return (
              <div
                className="pw-scan-row"
                key={row.id}
              >

                <Field label="Ingredient">
                  <input
                    value={row.name}
                    maxLength={150}
                    required
                    disabled={disabled}
                    onChange={(event) =>
                      editRow(
                        row.id,
                        "name",
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field label="Quantity">
                  <input
                    type="number"
                    min="0.01"
                    max="100000"
                    step="0.01"
                    value={row.quantity}
                    required
                    disabled={disabled}
                    onChange={(event) =>
                      editRow(
                        row.id,
                        "quantity",
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field label="Unit">
                  <select
                    value={row.unit}
                    disabled={disabled}
                    onChange={(event) =>
                      editRow(
                        row.id,
                        "unit",
                        event.target.value
                      )
                    }
                  >
                    {UNITS.map((unit) => (
                      <option key={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Category">
                  <input
                    value={row.category}
                    maxLength={50}
                    disabled={disabled}
                    onChange={(event) =>
                      editRow(
                        row.id,
                        "category",
                        event.target.value
                      )
                    }
                  />
                </Field>

                <Field label="Expires (optional)">
                  <input
                    type="date"
                    value={row.expiration_date}
                    disabled={disabled}
                    onChange={(event) =>
                      editRow(
                        row.id,
                        "expiration_date",
                        event.target.value
                      )
                    }
                  />
                </Field>

                <button
                  type="button"
                  className="btn"
                  disabled={busy}
                  onClick={() =>
                    setScanRows((previous) =>
                      previous.filter(
                        (item) => item.id !== row.id
                      )
                    )
                  }
                >
                  Remove
                </button>

                {row.status && (
                  <span
                    className="pw-row-status"
                    role="status"
                  >
                    {row.status === "Added"
                      ? "✓ Added to pantry"
                      : row.status}
                  </span>
                )}

              </div>
            );
          })}

          <div className="pw-actions">

            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={() =>
                setScanRows((previous) => [
                  ...previous,
                  rowFor(""),
                ])
              }
            >
              + Add row
            </button>

            <button
              type="submit"
              className="pw-primary"
              disabled={
                busy ||
                !scanRows.some(
                  (row) => row.status !== "Added"
                )
              }
            >
              Confirm & add to pantry
            </button>

          </div>

        </form>

      </Card>

    </div>
  );
}
