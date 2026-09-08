import React, { useState, useEffect } from "react";
import { Mic, MicOff, X, Sparkles, Volume2 } from "lucide-react";

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (text: string) => void;
  t: {
    CARD: string;
    BG: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    ACCENT: string;
    ACCENT_BG: string;
  };
  lang: "th" | "en";
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  onCommand,
  t,
  lang,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript("");
      setErrorMessage(null);
      return;
    }

    // Check Web Speech API support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        lang === "th"
          ? "เบราว์เซอร์นี้ยังไม่รองรับ Speech Recognition โดยตรง คุณสามารถพิมพ์หรือกดคำสั่งด่วนด้านล่างได้"
          : "Speech Recognition is not supported on this browser. Try the quick commands below."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "th" ? "th-TH" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          onCommand(resultTranscript);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage(lang === "th" ? "กรุณาอนุญาตการเข้าถึงไมโครโฟน" : "Microphone access denied.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      };
    } catch (e) {
      console.warn("Speech init error", e);
    }
  }, [isOpen, lang, onCommand, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: "เช็คอิน อ่านหนังสือ", cmd: "อ่านหนังสือ" },
    { label: "เช็คอิน ออกกำลังกาย", cmd: "ออกกำลังกาย" },
    { label: "เช็คอิน ดื่มน้ำ", cmd: "ดื่มน้ำ" },
    { label: "เริ่มจับเวลาโฟกัส", cmd: "เริ่มจับเวลา" },
    { label: "สุ่มกล่องกาชา", cmd: "สุ่มกาชา" },
    { label: "สลับโหมดมืด/สว่าง", cmd: "โหมดมืด" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        style={{
          background: t.CARD,
          color: t.TEXT_MAIN,
          borderRadius: 32,
        }}
        className="modal-pop w-full max-w-sm p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Animated Mic Button */}
          <div className="relative mb-5">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isListening ? "animate-pulse" : ""
              }`}
              style={{
                background: isListening ? t.ACCENT : t.ACCENT_BG,
                color: isListening ? "#FFF" : t.ACCENT,
              }}
            >
              {isListening ? <Mic size={36} /> : <MicOff size={36} />}
            </div>
            {isListening && (
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
                style={{ background: t.ACCENT }}
              />
            )}
          </div>

          <h3 className="text-xl font-extrabold mb-1">
            {isListening
              ? lang === "th"
                ? "กำลังฟังเสียงของคุณ..."
                : "Listening to your voice..."
              : lang === "th"
              ? "สั่งงานด้วยเสียง"
              : "Voice Command"}
          </h3>

          <p className="text-xs text-slate-400 mb-4 max-w-[240px]">
            {lang === "th"
              ? "พูดเช่น: 'อ่านหนังสือ', 'ออกกำลังกาย', 'เริ่มจับเวลา', 'สุ่มกาชา'"
              : "Say: 'read book', 'exercise', 'start timer', 'gacha'"}
          </p>

          {/* Transcript Box */}
          <div
            style={{ background: t.BG }}
            className="w-full min-h-[50px] p-3 rounded-2xl mb-4 flex items-center justify-center text-center text-sm font-bold text-slate-700 dark:text-slate-200"
          >
            {transcript ? (
              <span className="text-cyan-600 dark:text-cyan-400">"{transcript}"</span>
            ) : (
              <span className="text-xs text-slate-400 font-normal">
                {isListening
                  ? lang === "th"
                    ? "พูดสิ่งที่ต้องการได้เลย..."
                    : "Speak now..."
                  : lang === "th"
                  ? "กดคำสั่งด่วนด้านล่างเพื่อทดสอบได้ทันที"
                  : "Click a quick command below to test"}
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="text-xs text-amber-500 font-medium mb-3">
              {errorMessage}
            </div>
          )}

          {/* Quick Voice Chips */}
          <div className="w-full mt-2 text-left">
            <div className="text-[11px] font-extrabold uppercase text-slate-400 mb-2 flex items-center gap-1">
              <Sparkles size={12} />
              <span>{lang === "th" ? "คำสั่งด่วนยอดนิยม" : "Popular Commands"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTranscript(q.cmd);
                    onCommand(q.cmd);
                    setTimeout(onClose, 600);
                  }}
                  style={{ background: t.BG }}
                  className="btn-scale text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
