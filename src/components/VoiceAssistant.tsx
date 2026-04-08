import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLastCommand("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(text);
    };
    recognition.onend = () => {
      setListening(false);
      if (transcript) {
        setLastCommand(transcript);
        onCommand(transcript.toLowerCase());
        setTranscript("");
      }
    };
    recognition.onerror = () => setListening(false);

    recognition.start();
  }, [onCommand, transcript]);

  return (
    <div className="glass rounded-lg p-3 space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" /> Voice Assistant
        </h3>
        <Button
          size="sm"
          variant={listening ? "destructive" : "default"}
          className="text-xs h-7 px-2"
          onClick={startListening}
          disabled={listening}
        >
          {listening ? <><MicOff className="w-3 h-3" /> Listening…</> : <><Mic className="w-3 h-3" /> Speak</>}
        </Button>
      </div>
      {listening && transcript && (
        <p className="text-xs text-muted-foreground italic">"{transcript}"</p>
      )}
      {lastCommand && !listening && (
        <div className="text-xs bg-muted/40 rounded-md px-2 py-1.5">
          <span className="text-muted-foreground">Command: </span>
          <span className="text-foreground">"{lastCommand}"</span>
        </div>
      )}
    </div>
  );
}
