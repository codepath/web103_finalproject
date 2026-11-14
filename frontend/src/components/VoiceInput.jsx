
import {
  useEffect,
  useRef,
  useState,
} from "react";

// ==========================================
// MICROPHONE INPUT
// ==========================================

export default function VoiceInput({
  onTranscript,
  disabled,
}) {

  const recognitionRef = useRef(null);

  const [listening, setListening] =
    useState(false);

  const [error, setError] =
    useState("");

  // Support browsers that provide
  // Web Speech Recognition.

  const Recognition =
    typeof window !== "undefined"

      ? window.SpeechRecognition ||
        window.webkitSpeechRecognition

      : null;

  // Clean up microphone recognition
  // when the component is removed.

  useEffect(() => {

    return () => {

      const recognition =
        recognitionRef.current;

      if (recognition) {

        recognition.onresult = null;

        recognition.onend = null;

        recognition.onerror = null;

        recognition.abort();
      }
    };

  }, []);

  // Stop listening while the AI
  // is processing a request.

  useEffect(() => {

    if (disabled) {

      recognitionRef.current?.abort();
    }

  }, [disabled]);

  // Hide the microphone on browsers
  // without speech recognition.

  if (!Recognition) {
    return null;
  }

  // ========================================
  // START OR STOP VOICE RECOGNITION
  // ========================================

  function start() {

    if (listening) {

      recognitionRef.current?.stop();

      return;
    }

    if (disabled) return;

    setError("");

    const recognition = new Recognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;

    recognition.maxAlternatives = 1;

    // Put recognized words into
    // the existing chatbot input.

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      onTranscript(
        transcript.slice(0, 2000)
      );
    };

    // Stop the listening animation.

    recognition.onend = () => {

      setListening(false);

      recognitionRef.current = null;
    };

    // Handle microphone errors.

    recognition.onerror = (event) => {

      setListening(false);

      if (event.error === "aborted") {
        return;
      }

      setError(

        event.error === "not-allowed"

          ? "Microphone access denied."

          : "Voice recognition failed."
      );
    };

    try {

      setListening(true);

      recognition.start();

    } catch {

      setListening(false);

      recognitionRef.current = null;

      setError(
        "Could not start microphone."
      );
    }
  }

  // ========================================
  // RENDER MICROPHONE BUTTON
  // ========================================

  return (
    <span className="pw-mic-wrap">

      <button
        type="button"

        className={`pw-mic ${
          listening
            ? "pw-listening"
            : ""
        }`}

        title="Voice recognition may send audio to your browser's speech service"

        aria-label={
          listening

            ? "Stop listening"

            : "Speak to your chef"
        }

        aria-pressed={listening}

        disabled={disabled}

        onClick={start}
      >
        {listening ? "⏹" : "🎤"}
      </button>

      {(listening || error) && (

        <span
          className="pw-mic-status"

          role={error ? "alert" : "status"}
        >
          {error || "Listening…"}
        </span>

      )}

    </span>
  );
}
