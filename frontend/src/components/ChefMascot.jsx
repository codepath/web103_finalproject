
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";
import { api } from "../api.js";
import ChefCookingGuide from "./ChefCookingGuide.jsx";
import "../styles/chefMascot.css";

function getTimeMood(hour) {
  if (hour < 6 || hour >= 22) {
    return {
      emotion: "sleepy",
      message: "Up late? Need help?",
    };
  }

  if (hour < 12) {
    return {
      emotion: "happy",
      message: "Good morning!",
    };
  }

  if (hour < 18) {
    return {
      emotion: "idle",
      message: "Need help?",
    };
  }

  return {
    emotion: "happy",
    message: "What's for dinner?",
  };
}

function ChefCharacter({
  emotion,
  shopping,
  cooking,
  speaking,
  svgRef,
}) {
  const sleepy = emotion === "sleepy";
  const worried = emotion === "worried";
  const thinking = emotion === "thinking";
  const happy =
    emotion === "happy" ||
    emotion === "excited" ||
    emotion === "dancing";

  return (
    <svg
      ref={svgRef}
      className="chef-character"
      viewBox="0 0 160 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="chefSkin"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#FFE1B9" />
          <stop offset="1" stopColor="#DFA16D" />
        </linearGradient>

        <linearGradient
          id="chefCoat"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E5D9CA" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}

      <ellipse
        cx="82"
        cy="172"
        rx="42"
        ry="6"
        fill="#39291d"
        opacity=".18"
      />

      <g className="chef-body">
        {/* Legs and shoes */}

        <rect
          x="58"
          y="139"
          width="20"
          height="26"
          rx="7"
          fill="#39291d"
        />

        <rect
          x="84"
          y="139"
          width="20"
          height="26"
          rx="7"
          fill="#39291d"
        />

        <ellipse
          cx="66"
          cy="165"
          rx="15"
          ry="6"
          fill="#241B16"
        />

        <ellipse
          cx="96"
          cy="165"
          rx="15"
          ry="6"
          fill="#241B16"
        />

        {/* Left arm */}

        <path
          d="M53 108 Q29 113 32 138"
          stroke="#BFAE9D"
          strokeWidth="22"
          strokeLinecap="round"
        />

        <path
          d="M53 108 Q29 113 32 138"
          stroke="#F6F0E8"
          strokeWidth="18"
          strokeLinecap="round"
        />

        <circle
          cx="32"
          cy="143"
          r="10"
          fill="url(#chefSkin)"
          stroke="#A66D49"
          strokeWidth="1.5"
        />

        {/* Waving arm */}

        <g className="chef-wave-arm">
          <path
            d="M107 112 Q127 104 132 80"
            stroke="#BFAE9D"
            strokeWidth="22"
            strokeLinecap="round"
          />

          <path
            d="M107 112 Q127 104 132 80"
            stroke="#FFF9F1"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M124 78 L120 66
               Q119 61 123 60
               Q127 59 129 65
               L131 69 L131 52
               Q132 48 136 51
               L138 65 L142 55
               Q146 52 148 56
               L145 71
               Q146 83 136 86
               Q128 87 124 78Z"
            fill="url(#chefSkin)"
            stroke="#A66D49"
            strokeWidth="1.5"
          />
        </g>

        {/* Uniform */}

        <path
          d="M59 101 Q81 92 103 101
             Q117 115 112 146
             Q82 155 50 146
             Q45 118 59 101Z"
          fill="url(#chefCoat)"
          stroke="#BFAE9D"
          strokeWidth="2"
        />

        <path
          d="M62 101 L82 115 L101 101
             L94 96 L82 103 L69 96Z"
          fill="#C8553D"
        />

        <path
          d="M82 109 L73 130
             L85 126 L95 132 L88 109Z"
          fill="#BD4831"
        />

        {[121, 132, 143].map((y) => (
          <g key={y} fill="#725748">
            <circle cx="67" cy={y} r="2.5" />
            <circle cx="98" cy={y} r="2.5" />
          </g>
        ))}

        {/* Head */}

        <g className="chef-head">
          <ellipse
            cx="81"
            cy="67"
            rx="37"
            ry="36"
            fill="#513123"
          />

          <circle
            cx="46"
            cy="77"
            r="10"
            fill="url(#chefSkin)"
            stroke="#A66D49"
          />

          <circle
            cx="116"
            cy="77"
            r="10"
            fill="url(#chefSkin)"
            stroke="#A66D49"
          />

          <ellipse
            cx="81"
            cy="74"
            rx="34"
            ry="36"
            fill="url(#chefSkin)"
            stroke="#AD7654"
            strokeWidth="1.5"
          />

          {/* Hair */}

          <path
            d="M47 72 Q44 52 55 46
               L57 64 L52 77Z"
            fill="#513123"
          />

          <path
            d="M115 72 Q118 52 107 46
               L105 64 L110 77Z"
            fill="#513123"
          />

          {/* Emotional eyebrows */}

          <g
            stroke="#59392A"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path
              d={
                worried
                  ? "M60 64 L73 58"
                  : thinking
                  ? "M60 62 Q67 55 73 60"
                  : "M60 62 Q67 58 73 62"
              }
            />

            <path
              d={
                worried
                  ? "M91 58 L104 64"
                  : thinking
                  ? "M91 61 Q98 65 104 62"
                  : "M91 62 Q98 58 104 62"
              }
            />
          </g>

          {/* Blinking eyes and mouse tracking */}

          <g className="chef-eyes">
            {sleepy ? (
              <g
                stroke="#39291d"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M60 72 Q67 77 74 72" />
                <path d="M90 72 Q97 77 104 72" />
              </g>
            ) : emotion === "excited" ? (
              <g
                stroke="#39291d"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M60 73 Q67 65 74 73" />
                <path d="M90 73 Q97 65 104 73" />
              </g>
            ) : (
              <>
                <ellipse
                  cx="67"
                  cy="73"
                  rx="7"
                  ry="8"
                  fill="white"
                />

                <ellipse
                  cx="97"
                  cy="73"
                  rx="7"
                  ry="8"
                  fill="white"
                />

                <g className="chef-pupils">
                  <circle
                    cx="67"
                    cy="74"
                    r="4"
                    fill="#39291d"
                  />

                  <circle
                    cx="97"
                    cy="74"
                    r="4"
                    fill="#39291d"
                  />

                  <circle
                    cx="68"
                    cy="72"
                    r="1.4"
                    fill="white"
                  />

                  <circle
                    cx="98"
                    cy="72"
                    r="1.4"
                    fill="white"
                  />
                </g>
              </>
            )}
          </g>

          {/* Nose */}

          <path
            d="M81 75 Q75 84 83 84"
            stroke="#C38960"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Blushing cheeks */}

          <ellipse
            cx="58"
            cy="84"
            rx="7"
            ry="4"
            fill="#E98774"
            opacity=".5"
          />

          <ellipse
            cx="105"
            cy="84"
            rx="7"
            ry="4"
            fill="#E98774"
            opacity=".5"
          />

          {/* Changing facial expressions */}

          {speaking ? (
            <ellipse
              className="chef-speaking-mouth"
              cx="82"
              cy="94"
              rx="8"
              ry="6"
              fill="#713E2C"
            />
          ) : sleepy || thinking ? (
            <ellipse
              className={sleepy ? "chef-yawn" : ""}
              cx="82"
              cy="94"
              rx={sleepy ? "6" : "4"}
              ry={sleepy ? "7" : "3"}
              fill="#713E2C"
            />
          ) : worried ? (
            <path
              d="M72 98 Q82 87 92 98"
              stroke="#713E2C"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          ) : happy ? (
            <g>
              <path
                d="M68 89 Q81 96 95 89
                   Q91 104 81 104
                   Q72 103 68 89Z"
                fill="#713E2C"
              />

              <path
                d="M70 90 Q81 95 93 90
                   L91 95 Q81 99 72 95Z"
                fill="white"
              />

              <ellipse
                cx="81"
                cy="100"
                rx="6"
                ry="3"
                fill="#E98774"
              />
            </g>
          ) : (
            <path
              d="M72 91 Q81 100 91 91"
              stroke="#713E2C"
              strokeWidth="2.7"
              strokeLinecap="round"
            />
          )}

          {/* Chef hat */}

          <path
            d="M50 44
               Q33 44 33 28
               Q33 15 49 13
               Q54 2 68 8
               Q81 -4 95 9
               Q111 3 118 16
               Q133 18 132 32
               Q132 46 112 46
               L110 58
               Q81 63 52 58Z"
            fill="url(#chefCoat)"
            stroke="#BFAE9D"
            strokeWidth="2"
          />

          <path
            d="M65 15 Q59 26 64 36
               M94 15 Q101 25 95 36"
            stroke="#D9CEC0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            d="M52 46 Q81 41 111 46
               L110 58 Q81 63 52 58Z"
            fill="white"
            stroke="#CBB9A6"
          />

          <circle
            cx="81"
            cy="51"
            r="7"
            fill="#C8553D"
          />

          <text
            x="81"
            y="55"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            P
          </text>
        </g>

        {/* Shopping basket */}

        {shopping && (
          <g className="chef-shopping-basket">
            <path
              d="M7 134 Q15 112 31 134"
              stroke="#99613B"
              strokeWidth="4"
            />

            <path
              d="M3 134 L36 134
                 L30 160 L9 160Z"
              fill="#C99555"
              stroke="#99613B"
              strokeWidth="2"
            />

            <path
              d="M14 138 L15 156
                 M24 138 L23 156"
              stroke="#99613B"
              strokeWidth="2"
            />

            <circle
              cx="13"
              cy="131"
              r="7"
              fill="#D34F38"
            />

            <ellipse
              cx="26"
              cy="129"
              rx="7"
              ry="10"
              fill="#719753"
            />
          </g>
        )}

        {/* Animated cooking pot */}

        {cooking && (
          <g className="chef-cooking-pot">
            <path
              d="M12 136 L43 136
                 L39 159 L16 159Z"
              fill="#B85339"
              stroke="#713E2C"
              strokeWidth="2"
            />

            <ellipse
              cx="27"
              cy="136"
              rx="16"
              ry="4"
              fill="#D9A668"
            />

            <path
              className="chef-pot-spoon"
              d="M30 136 L42 111"
              stroke="#9A673F"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <g
              className="chef-pot-steam"
              stroke="#C5B39E"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M19 130 Q13 124 19 119" />
              <path d="M29 129 Q23 122 29 116" />
            </g>
          </g>
        )}
      </g>

      {/* Sleepy animation */}

      {sleepy && (
        <g
          className="chef-sleep-symbol"
          fill="#8B83BD"
          fontWeight="bold"
        >
          <text x="119" y="16" fontSize="13">
            Z
          </text>
          <text x="137" y="9" fontSize="17">
            Z
          </text>
        </g>
      )}

      {/* Recipe excitement */}

      {happy && (
        <g
          className="chef-sparkles"
          fill="#E9AD4E"
        >
          <path
            d="M19 35 L23 46 L34 50
               L23 54 L19 65 L15 54
               L4 50 L15 46Z"
          />

          <path
            d="M140 17 L143 24 L150 27
               L143 30 L140 37 L137 30
               L130 27 L137 24Z"
          />
        </g>
      )}
    </svg>
  );
}

export default function ChefMascot({
  open,
  loading,
  reply = "",
  hasError = false,
  preferences = {},
  onToggle,
}) {
  const location = useLocation();

  const [hovered, setHovered] = useState(false);
  const [hour, setHour] = useState(
    new Date().getHours()
  );

  const [pantry, setPantry] = useState([]);
  const [pantryAvailable, setPantryAvailable] =
    useState(false);

  const [currentRecipe, setCurrentRecipe] =
    useState(null);

  const [guideOpen, setGuideOpen] =
    useState(false);

  const [reaction, setReaction] =
    useState(null);

  const [voiceEnabled, setVoiceEnabled] =
    useState(false);

  const [speaking, setSpeaking] =
    useState(false);

  const [position, setPosition] =
    useState(null);

  const mascotRef = useRef(null);
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const reactionTimer = useRef(null);
  const wasLoading = useRef(false);
  const speechToken = useRef(0);

  const voiceSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const shopping =
    location.pathname === "/shopping";

  const discovering =
    location.pathname === "/recipes";

  const planning =
    location.pathname === "/planner";

  // ==========================================
  // 1. TIME-BASED PERSONALITY
  // ==========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setHour(new Date().getHours());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const timeMood = getTimeMood(hour);

  // ==========================================
  // 2. CELEBRATIONS AND DANCING
  // ==========================================

  const react = useCallback(
    (emotion, message, duration = 3500) => {
      clearTimeout(reactionTimer.current);

      setReaction({ emotion, message });

      reactionTimer.current = setTimeout(() => {
        setReaction(null);
      }, duration);
    },
    []
  );

  useEffect(() => {
    function handleEvent(event) {
      const detail = event.detail || {};

      if (detail.type === "celebrate") {
        react(
          "excited",
          detail.message || "Great job!"
        );
      }

      if (
        detail.type === "recipe-viewed" &&
        detail.recipe
      ) {
        setCurrentRecipe(detail.recipe);

        react(
          "happy",
          "That looks delicious!"
        );
      }
    }

    window.addEventListener(
      "prepwise:chef",
      handleEvent
    );

    return () => {
      window.removeEventListener(
        "prepwise:chef",
        handleEvent
      );
    };
  }, [react]);

  useEffect(() => {
    return () =>
      clearTimeout(reactionTimer.current);
  }, []);

  // ==========================================
  // 3. PANTRY ALERTS
  // ==========================================

  useEffect(() => {
    let active = true;
    let requesting = false;

    async function refreshPantry() {
      if (
        requesting ||
        document.visibilityState === "hidden"
      ) {
        return;
      }

      requesting = true;

      try {
        const rows = await api.get(
          "/pantry-items"
        );

        if (active) {
          setPantry(rows);
          setPantryAvailable(true);
        }
      } catch {
        if (active) {
          setPantryAvailable(false);
        }
      } finally {
        requesting = false;
      }
    }

    function onChefEvent(event) {
      if (
        event.detail?.type ===
        "pantry-updated"
      ) {
        refreshPantry();
      }
    }

    refreshPantry();

    const interval = setInterval(
      refreshPantry,
      60000
    );

    window.addEventListener(
      "focus",
      refreshPantry
    );

    window.addEventListener(
      "prepwise:chef",
      onChefEvent
    );

    document.addEventListener(
      "visibilitychange",
      refreshPantry
    );

    return () => {
      active = false;

      clearInterval(interval);

      window.removeEventListener(
        "focus",
        refreshPantry
      );

      window.removeEventListener(
        "prepwise:chef",
        onChefEvent
      );

      document.removeEventListener(
        "visibilitychange",
        refreshPantry
      );
    };
  }, [location.pathname]);

  const expiring = pantryAvailable
    ? pantry.filter(
        (item) =>
          Number(item.quantity) > 0 &&
          item.days_until_expiry != null &&
          Number(item.days_until_expiry) >= 0 &&
          Number(item.days_until_expiry) <= 3
      )
    : [];

  const expired = pantryAvailable
    ? pantry.filter(
        (item) =>
          Number(item.quantity) > 0 &&
          item.days_until_expiry != null &&
          Number(item.days_until_expiry) < 0
      )
    : [];

  // ==========================================
  // 4. EYES FOLLOW YOUR CURSOR
  // ==========================================

  useEffect(() => {
    let frame;

    function trackEyes(event) {
      if (!svgRef.current) return;

      if (
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {
        return;
      }

      const x = event.clientX;
      const y = event.clientY;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect =
          svg.getBoundingClientRect();

        const centerX =
          rect.left + rect.width * 0.5;

        const centerY =
          rect.top + rect.height * 0.4;

        const dx = x - centerX;
        const dy = y - centerY;

        const distance =
          Math.hypot(dx, dy) || 1;

        const strength =
          Math.min(distance / 100, 1);

        svg.style.setProperty(
          "--eye-x",
          `${(dx / distance) * strength * 2.7}px`
        );

        svg.style.setProperty(
          "--eye-y",
          `${(dy / distance) * strength * 2.2}px`
        );
      });
    }

    window.addEventListener(
      "pointermove",
      trackEyes,
      { passive: true }
    );

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "pointermove",
        trackEyes
      );
    };
  }, []);

  // ==========================================
  // 5. VOICE AND ANIMATED LIP MOVEMENT
  // ==========================================

  const stopSpeaking = useCallback(() => {
    speechToken.current++;

    if (voiceSupported) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }, [voiceSupported]);

  const speak = useCallback(
    (text) => {
      if (
        !voiceSupported ||
        !text?.trim()
      ) {
        return;
      }

      stopSpeaking();

      const token = ++speechToken.current;

      const cleanText = text
        .replace(/[*#`]/g, "")
        .slice(0, 3500);

      const utterance =
        new SpeechSynthesisUtterance(
          cleanText
        );

      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        if (speechToken.current === token) {
          setSpeaking(true);
        }
      };

      utterance.onend = () => {
        if (speechToken.current === token) {
          setSpeaking(false);
        }
      };

      utterance.onerror = () => {
        if (speechToken.current === token) {
          setSpeaking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [voiceSupported, stopSpeaking]
  );

  useEffect(() => {
    return () => {
      speechToken.current++;

      if (voiceSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceSupported]);

  function toggleVoice() {
    if (!voiceSupported) return;

    if (voiceEnabled) {
      setVoiceEnabled(false);
      stopSpeaking();
    } else {
      setVoiceEnabled(true);
      speak("Hi! Your PrepWise chef is ready.");
    }
  }

  // React to completed AI requests.
  // Historical messages are not automatically read.

  useEffect(() => {
    if (loading && !wasLoading.current) {
      stopSpeaking();
    }

    if (wasLoading.current && !loading) {
      if (hasError) {
        react(
          "worried",
          "Let's try again."
        );
      } else if (reply) {
        react(
          "excited",
          "Your answer is ready!"
        );

        if (voiceEnabled) {
          speak(reply);
        }
      }
    }

    wasLoading.current = loading;
  }, [
    loading,
    reply,
    hasError,
    voiceEnabled,
    speak,
    stopSpeaking,
    react,
  ]);

  // ==========================================
  // 6. DRAGGABLE CHARACTER
  // ==========================================

  function startDrag(event) {
    if (open || !mascotRef.current) return;

    const rect =
      mascotRef.current.getBoundingClientRect();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function moveDrag(event) {
    const drag = dragRef.current;

    if (
      !drag ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const maxLeft = Math.max(
      8,
      window.innerWidth - drag.width - 8
    );

    const maxTop = Math.max(
      8,
      window.innerHeight - drag.height - 8
    );

    setPosition({
      left: Math.max(
        8,
        Math.min(
          maxLeft,
          drag.left +
            event.clientX -
            drag.startX
        )
      ),

      top: Math.max(
        8,
        Math.min(
          maxTop,
          drag.top +
            event.clientY -
            drag.startY
        )
      ),
    });
  }

  function endDrag() {
    dragRef.current = null;
  }

  useEffect(() => {
    if (open) {
      setPosition(null);
    }
  }, [open]);

  useEffect(() => {
    function resetOnResize() {
      setPosition(null);
    }

    window.addEventListener(
      "resize",
      resetOnResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resetOnResize
      );
  }, []);

  // ==========================================
  // 7. CHOOSE THE CHEF'S CURRENT MOOD
  // ==========================================

  let emotion = timeMood.emotion;
  let message = timeMood.message;

  const diet = preferences.diet;

  if (diet && diet !== "Any") {
    message = `Let's cook ${diet.toLowerCase()}!`;
  }

  if (discovering) {
    emotion = "happy";
    message = "Find something tasty!";
  }

  if (planning) {
    emotion = "happy";
    message = "Plan a delicious week!";
  }

  if (shopping) {
    emotion = "happy";
    message = "Let's go shopping!";
  }

  if (hovered) {
    emotion = "happy";
    message = "Let's cook!";
  }

  if (open) {
    emotion = "happy";
    message = "I'm here!";
  } else if (expired.length) {
    emotion = "worried";
    message =
      `${expired.length} pantry item` +
      `${expired.length === 1 ? "" : "s"} past date!`;
  } else if (expiring.length) {
    emotion = "worried";
    message =
      `${expiring.length} item` +
      `${expiring.length === 1 ? "" : "s"} expiring soon!`;
  }

  if (reaction) {
    emotion = reaction.emotion;
    message = reaction.message;
  }

  if (speaking) {
    emotion = "happy";
    message = "Listen up!";
  }

  if (loading) {
    emotion = "thinking";
    message = "Thinking...";
  }

  // ==========================================
  // 8. GUIDED COOKING MODE
  // ==========================================

  function openCookingGuide() {
    if (open) onToggle();

    setGuideOpen(true);
  }

  if (guideOpen) {
    return (
      <ChefCookingGuide
        initialRecipe={currentRecipe}
        preferences={preferences}
        voiceSupported={voiceSupported}
        onSpeak={speak}
        onStopSpeaking={stopSpeaking}
        onClose={() =>
          setGuideOpen(false)
        }
        onComplete={() => {
          setGuideOpen(false);

          react(
            "excited",
            "You did it, Chef! 🎉",
            5000
          );

          if (voiceEnabled) {
            speak(
              "Great job, Chef! Enjoy your meal."
            );
          }
        }}
      />
    );
  }

  return (
    <div
      ref={mascotRef}
      className={`chef-mascot-container ${
        open ? "chef-compact" : ""
      }`}
      style={
        position && !open
          ? {
              left: position.left,
              top: position.top,
              right: "auto",
              bottom: "auto",
            }
          : undefined
      }
    >
      {/* Main interactive character */}

      <button
        type="button"
        className={`chef-mascot-button ${emotion}`}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={
          open
            ? "Close PrepWise AI"
            : "Open PrepWise AI"
        }
        aria-expanded={open}
      >
        <span className="chef-speech">
          {message}
        </span>

        <ChefCharacter
          svgRef={svgRef}
          emotion={emotion}
          shopping={shopping}
          cooking={!shopping && (planning || loading)}
          speaking={speaking}
        />

        <span className="chef-action-label">
          {open ? "×" : "Ask AI"}
        </span>
      </button>

      {/* Click the chef's hat to dance */}

      {!open && (
        <button
          type="button"
          className="chef-hat-button"
          aria-label="Make chef dance"
          title="Tap my hat!"
          onClick={() =>
            react(
              "dancing",
              "Happy dance!",
              4000
            )
          }
        />
      )}

      {/* Optional voice and cooking controls */}

      <div className="chef-controls">
        {voiceSupported && (
          <button
            type="button"
            title={
              voiceEnabled
                ? "Disable chef voice"
                : "Enable chef voice"
            }
            aria-label={
              voiceEnabled
                ? "Disable chef voice"
                : "Enable chef voice"
            }
            aria-pressed={voiceEnabled}
            onClick={toggleVoice}
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>
        )}

        {voiceSupported && reply && (
          <button
            type="button"
            title={
              speaking
                ? "Stop speaking"
                : "Read latest AI answer"
            }
            aria-label={
              speaking
                ? "Stop speaking"
                : "Read latest AI answer"
            }
            disabled={loading}
            onClick={() =>
              speaking
                ? stopSpeaking()
                : speak(reply)
            }
          >
            {speaking ? "⏹" : "▶"}
          </button>
        )}

        {!open && (
          <>
            <button
              type="button"
              title="Start guided cooking"
              aria-label="Start guided cooking"
              onClick={openCookingGuide}
            >
              🍳
            </button>

            <button
              type="button"
              className="chef-drag-handle"
              title="Drag the chef"
              aria-label="Drag chef; press to reset position"
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onClick={(event) => {
                // Keyboard activation resets position.
                if (event.detail === 0) {
                  setPosition(null);
                }
              }}
            >
              ✥
            </button>

            {position && (
              <button
                type="button"
                title="Reset position"
                aria-label="Reset chef position"
                onClick={() =>
                  setPosition(null)
                }
              >
                ↺
              </button>
            )}
          </>
        )}
      </div>

      {/* Proactive pantry reminder */}

      {!open &&
        pantryAvailable &&
        (expired.length > 0 ||
          expiring.length > 0) && (
          <button
            type="button"
            className="chef-alert-button"
            title="Ask AI about pantry ingredients"
            onClick={onToggle}
          >
            🥕 Check your pantry
          </button>
        )}

      {/* Celebration confetti */}

      {reaction?.emotion === "excited" && (
        <div
          className="chef-confetti"
          aria-hidden="true"
        >
          {Array.from(
            { length: 12 },
            (_, index) => (
              <i
                key={index}
                style={{
                  "--confetti-x":
                    `${(index - 5.5) * 19}px`,

                  "--confetti-delay":
                    `${index * 0.055}s`,

                  background:
                    [
                      "#C8553D",
                      "#E9AD4E",
                      "#72964F",
                      "#A48BD2",
                    ][index % 4],
                }}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
