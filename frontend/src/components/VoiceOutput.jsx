import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "../styles/voiceOutput.css";

function cleanText(text) {
  return String(text || "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*#`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSpeech(text) {
  const words = cleanText(text).split(" ");
  const chunks = [];
  let current = "";

  for (const word of words) {
    const next = current
      ? `${current} ${word}`
      : word;

    if (next.length > 200 && current) {
      chunks.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);

  return chunks;
}

export default function VoiceOutput({
  reply = "",
  responseId = 0,
}) {
  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const [enabled, setEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [notice, setNotice] = useState("");

  const speechRef = useRef(null);
  const generationRef = useRef(0);

  const previousReply = useRef({
    reply,
    responseId,
  });

  const stopSpeaking = useCallback(() => {
    generationRef.current++;
    speechRef.current = null;

    if (supported) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  }, [supported]);

  // Load available browser voices.

  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    function loadVoices() {
      const available = synth.getVoices();

      const english = available.filter(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en")
      );

      setVoices(
        english.length ? english : available
      );
    }

    loadVoices();

    synth.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      synth.removeEventListener(
        "voiceschanged",
        loadVoices
      );

      generationRef.current++;
      speechRef.current = null;
      synth.cancel();
    };
  }, [supported]);

  // Stop speaking when the microphone is used.

  useEffect(() => {
    window.addEventListener(
      "prepwise:stop-voice",
      stopSpeaking
    );

    return () => {
      window.removeEventListener(
        "prepwise:stop-voice",
        stopSpeaking
      );
    };
  }, [stopSpeaking]);

  // Speak an AI response.

  const speak = useCallback(
    (text) => {
      if (!supported || !text?.trim()) return;

      stopSpeaking();
      setNotice("");

      const chunks = splitSpeech(text);

      if (!chunks.length) return;

      const synth = window.speechSynthesis;
      const generation = generationRef.current;

      const selected = voices.find(
        (voice) =>
          voice.voiceURI === selectedVoice
      );

      const preferred =
        selected ||
        voices.find(
          (voice) =>
            voice.localService &&
            voice.lang === "en-US"
        ) ||
        voices.find(
          (voice) => voice.lang === "en-US"
        );

      let index = 0;

      function playNext() {
        if (
          generation !== generationRef.current
        ) {
          return;
        }

        if (index >= chunks.length) {
          speechRef.current = null;
          setSpeaking(false);
          return;
        }

        const utterance =
          new window.SpeechSynthesisUtterance(
            chunks[index++]
          );

        utterance.lang =
          preferred?.lang || "en-US";

        if (preferred) {
          utterance.voice = preferred;
        }

        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        speechRef.current = utterance;

        utterance.onstart = () => {
          if (
            generation === generationRef.current
          ) {
            setSpeaking(true);
          }
        };

        utterance.onend = () => {
          if (
            generation === generationRef.current
          ) {
            playNext();
          }
        };

        utterance.onerror = (event) => {
          if (
            generation !== generationRef.current
          ) {
            return;
          }

          speechRef.current = null;
          setSpeaking(false);

          if (
            event.error !== "canceled" &&
            event.error !== "interrupted"
          ) {
            setNotice(
              "Audio could not start. Tap Replay to try again."
            );
          }
        };

        try {
          synth.speak(utterance);
        } catch {
          speechRef.current = null;
          setSpeaking(false);

          setNotice(
            "Voice output is unavailable. Try Replay."
          );
        }
      }

      synth.resume();
      setSpeaking(true);
      playNext();
    },
    [
      supported,
      voices,
      selectedVoice,
      rate,
      stopSpeaking,
    ]
  );

  // Automatically speak new AI responses.

  useEffect(() => {
    const previous = previousReply.current;

    const changed =
      previous.reply !== reply ||
      previous.responseId !== responseId;

    previousReply.current = {
      reply,
      responseId,
    };

    if (!changed) return;

    if (!reply) {
      stopSpeaking();
      return;
    }

    if (enabled) {
      speak(reply);
    }
  }, [
    reply,
    responseId,
    enabled,
    speak,
    stopSpeaking,
  ]);

  function toggleVoice() {
    if (enabled) {
      setEnabled(false);
      stopSpeaking();
      setNotice("");
      return;
    }

    setEnabled(true);

    speak(
      "PrepWise voice assistant is ready."
    );
  }

  if (!supported) {
    return (
      <div className="pw-voice-unavailable">
        Voice output is unavailable in this browser.
      </div>
    );
  }

  return (
    <section
      className="pw-voice-controls"
      aria-label="AI voice output"
    >
      <div className="pw-voice-actions">
        <button
          type="button"
          className={
            enabled ? "pw-voice-active" : ""
          }
          onClick={toggleVoice}
          aria-pressed={enabled}
        >
          {enabled
            ? "🔊 Voice On"
            : "🔇 Voice Off"}
        </button>

        <button
          type="button"
          disabled={!reply}
          onClick={() => speak(reply)}
        >
          ▶ Replay
        </button>

        <button
          type="button"
          disabled={!speaking}
          onClick={stopSpeaking}
        >
          ⏹ Stop
        </button>
      </div>

      <div className="pw-voice-settings">
        <select
          aria-label="Select AI voice"
          value={selectedVoice}
          onChange={(event) =>
            setSelectedVoice(event.target.value)
          }
        >
          <option value="">
            Default voice
          </option>

          {voices.map((voice) => (
            <option
              key={voice.voiceURI}
              value={voice.voiceURI}
            >
              {voice.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Speech speed"
          value={rate}
          onChange={(event) =>
            setRate(Number(event.target.value))
          }
        >
          <option value="0.8">0.8x</option>
          <option value="1">1x</option>
          <option value="1.2">1.2x</option>
          <option value="1.4">1.4x</option>
        </select>
      </div>

      {speaking && (
        <small
          className="pw-voice-status"
          role="status"
        >
          Chef is speaking…
        </small>
      )}

      {notice && (
        <small
          className="pw-voice-status"
          role="alert"
        >
          {notice}
        </small>
      )}
    </section>
  );
}