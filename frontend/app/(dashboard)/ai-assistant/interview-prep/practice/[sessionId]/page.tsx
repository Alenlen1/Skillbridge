"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaChevronLeft,
  FaTimesCircle,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaKeyboard,
  FaCheckCircle,
  FaCode,
  FaUserTie,
  FaSitemap,
} from "react-icons/fa";
import { IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";

interface QuestionAttempt {
  id: string;
  question: string;
  type: "technical" | "behavioral" | "situational";
  tip: string | null;
  order: number;
  userAnswer: string | null;
  feedback: string | null;
  score: number | null;
  strengths: string[];
  improvements: string[];
}

interface Session {
  id: string;
  targetRole: string;
  status: "in_progress" | "completed";
  overallScore: number | null;
  overallFeedback: string | null;
  strengths: string[];
  improvements: string[];
  questions: QuestionAttempt[];
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  technical: <FaCode size={10} />,
  behavioral: <FaUserTie size={10} />,
  situational: <FaSitemap size={10} />,
};

export default function InterviewPracticePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "type">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setInputMode("type");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswerText(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const pickBestVoice = (voices: SpeechSynthesisVoice[]): string => {
      const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
      const pool = englishVoices.length > 0 ? englishVoices : voices;

      // Prefer higher-quality voices (Google/Natural/Neural/Online) over
      // default robotic system voices.
      const preferred = pool.find((v) =>
        /google|natural|neural|online/i.test(v.name),
      );
      const usEnglish = pool.find((v) => v.lang === "en-US");

      return (preferred ?? usEnglish ?? pool[0])?.voiceURI ?? "";
    };

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      setAvailableVoices(voices);
      setSelectedVoiceURI((prev) => prev || pickBestVoice(voices));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/interview/${sessionId}`);
        if (data.success) {
          setSession(data.data);
          const firstUnanswered = data.data.questions.findIndex(
            (q: QuestionAttempt) => !q.userAnswer,
          );
          setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
        } else {
          setError(data.error?.message || "Could not load this session.");
        }
      } catch {
        setError("Failed to load this interview session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const currentQuestion = session?.questions[currentIndex];

  const speakQuestion = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const voice = availableVoices.find(
        (v) => v.voiceURI === selectedVoiceURI,
      );
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, selectedVoiceURI],
  );

  useEffect(() => {
    if (currentQuestion && !currentQuestion.userAnswer) {
      speakQuestion(currentQuestion.question);
    }
    setAnswerText("");
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [currentIndex, currentQuestion, speakQuestion]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setAnswerText("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !currentQuestion || !answerText.trim()) return;
    setSubmitting(true);
    setError("");
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    try {
      const { data } = await api.post(
        `/interview/${session.id}/questions/${currentQuestion.id}/answer`,
        { answer: answerText.trim() },
      );

      if (data.success) {
        setSession((prev) => {
          if (!prev) return prev;
          const updatedQuestions = prev.questions.map((q) =>
            q.id === currentQuestion.id ? data.data : q,
          );
          return { ...prev, questions: updatedQuestions };
        });
      } else {
        setError(data.error?.message || "Could not submit your answer.");
      }
    } catch {
      setError("Failed to submit your answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleComplete = async () => {
    if (!session) return;
    setCompleting(true);
    setError("");
    try {
      const { data } = await api.post(`/interview/${session.id}/complete`);
      if (data.success) {
        setSession(data.data);
      } else {
        setError(data.error?.message || "Could not complete this session.");
      }
    } catch {
      setError("Failed to complete this session. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-white/20 border-t-indigo-400" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
        <FaTimesCircle
          className="mt-0.5 flex-shrink-0 text-red-400"
          size={14}
        />
        <p className="text-xs text-red-300">{error}</p>
      </div>
    );
  }

  if (!session) return null;

  const allAnswered = session.questions.every((q) => q.userAnswer);
  const isLastQuestion = currentIndex === session.questions.length - 1;

  // Completed session summary view
  if (session.status === "completed") {
    return (
      <div>
        <div className="mb-7">
          <Link
            href="/ai-assistant/interview-prep"
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            <FaChevronLeft size={10} />
            Interview Prep
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <FaCheckCircle size={16} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                Session Complete
              </h1>
              <p className="text-xs text-slate-500">{session.targetRole}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] p-5 text-center">
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
              Overall Score
            </p>
            <p className="text-4xl font-bold text-emerald-400">
              {session.overallScore}
              <span className="text-lg text-slate-500">/100</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {session.overallFeedback}
            </p>
          </div>

          {session.strengths.length > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
              <h3 className="mb-3 text-sm font-semibold text-emerald-400">
                Strengths
              </h3>
              <ul className="space-y-2">
                {session.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.improvements.length > 0 && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-5">
              <h3 className="mb-3 text-sm font-semibold text-yellow-400">
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {session.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
                    <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Question Breakdown
            </h3>
            {session.questions.map((q, i) => (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">
                    {i + 1}. {q.question}
                  </p>
                  {q.score !== null && (
                    <span className="flex-shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                      {q.score}/100
                    </span>
                  )}
                </div>
                {q.feedback && (
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {q.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/ai-assistant/interview-prep"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] py-2.5 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:border-slate-300 dark:border-white/[0.14] hover:text-slate-900 dark:hover:text-white"
            >
              Back to Interview Prep
            </Link>
            <Link
              href="/ai-assistant/interview-prep/history"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500/10 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            >
              <IconSparkles size={14} stroke={1.5} />
              View Interview History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active session view
  return (
    <div>
      <div className="mb-7">
        <Link
          href="/ai-assistant/interview-prep"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
        >
          <FaChevronLeft size={10} />
          Interview Prep
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Mock Interview — {session.targetRole}
            </h1>
            <p className="text-xs text-slate-500">
              Question {currentIndex + 1} of {session.questions.length}
            </p>
          </div>
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{
                width: `${((currentIndex + 1) / session.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="space-y-5">
          {/* Question card */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                {TYPE_ICON[currentQuestion.type]}
                {currentQuestion.type.charAt(0).toUpperCase() +
                  currentQuestion.type.slice(1)}
              </span>
              <div className="flex items-center gap-3">
                {availableVoices.length > 1 && (
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-2 py-1 text-[10px] text-slate-500 dark:text-slate-400 outline-none transition-colors focus:border-indigo-500/50"
                  >
                    {availableVoices
                      .filter((v) => v.lang.startsWith("en"))
                      .map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}
                        </option>
                      ))}
                  </select>
                )}
                <button
                  onClick={() => speakQuestion(currentQuestion.question)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-indigo-400"
                >
                  <FaVolumeUp size={11} />
                  Replay
                </button>
              </div>
            </div>
            <p className="text-base font-medium leading-relaxed text-slate-900 dark:text-white">
              {currentQuestion.question}
            </p>
          </div>

          {/* Already answered -> show feedback */}
          {currentQuestion.userAnswer ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Your Answer
                </p>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentQuestion.userAnswer}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.05] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-indigo-400">
                    AI Feedback
                  </p>
                  {currentQuestion.score !== null && (
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                      {currentQuestion.score}/100
                    </span>
                  )}
                </div>
                <p className="mb-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentQuestion.feedback}
                </p>
                {currentQuestion.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                      Strengths
                    </p>
                    <ul className="space-y-1">
                      {currentQuestion.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-500 dark:text-slate-400"
                        >
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentQuestion.improvements.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-yellow-400">
                      Improve
                    </p>
                    <ul className="space-y-1">
                      {currentQuestion.improvements.map((s, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-500 dark:text-slate-400"
                        >
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isLastQuestion ? (
                allAnswered && (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {completing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-white/20 border-t-white" />
                        Finishing up...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle size={13} />
                        Finish & See Results
                      </>
                    )}
                  </button>
                )
              ) : (
                <button
                  onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                >
                  Next Question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Input mode toggle */}
              {speechSupported && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputMode("voice")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
                      inputMode === "voice"
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <FaMicrophone size={11} />
                    Voice
                  </button>
                  <button
                    onClick={() => setInputMode("type")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
                      inputMode === "type"
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <FaKeyboard size={11} />
                    Type
                  </button>
                </div>
              )}

              {inputMode === "voice" && speechSupported ? (
                <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] p-5 text-center">
                  <button
                    onClick={toggleRecording}
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      isRecording
                        ? "bg-red-500 animate-pulse"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {isRecording ? (
                      <FaMicrophoneSlash
                        className="text-slate-900 dark:text-white"
                        size={20}
                      />
                    ) : (
                      <FaMicrophone
                        className="text-slate-900 dark:text-white"
                        size={20}
                      />
                    )}
                  </button>
                  <p className="mb-3 text-xs text-slate-500">
                    {isRecording
                      ? "Listening... tap to stop"
                      : "Tap to start answering"}
                  </p>
                  {(answerText || !isRecording) && (
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Your transcribed answer will appear here — you can edit it anytime"
                      rows={5}
                      disabled={isRecording}
                      className="w-full resize-none rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-slate-700 dark:text-slate-300 outline-none transition-colors focus:border-indigo-500/50 disabled:opacity-70"
                    />
                  )}
                </div>
              ) : (
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-slate-100 dark:focus:bg-white/[0.05]"
                />
              )}

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
                  <FaTimesCircle
                    className="mt-0.5 flex-shrink-0 text-red-400"
                    size={14}
                  />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || !answerText.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-white/20 border-t-white" />
                    Getting feedback...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
