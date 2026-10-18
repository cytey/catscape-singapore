import { useState } from "react";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";

const CATVERTER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cat-verter`;

const exampleTexts = [
  "I had a perfect day at the office today. The meeting went really well and I'm feeling positive about the future.",
  "Welcome to Singapore! The food here is fantastic and the people are very friendly.",
  "I need to go to the store to buy some groceries. Don't forget to pick up the kids from school.",
  "The weather forecast says it will rain forever. Better bring an umbrella!",
];

const CatVerter = () => {
  useSEO({
    title: "The Cat-verter – Transform Text into Cat Vocabulary",
    description: "Turn any boring hooman text into purr-fect cat puns and vocabulary with AI meow-gic. Free online cat-verter powered by CatScape Singapore.",
    keywords: ["cat pun generator", "cat translator", "cat text converter", "cat vocabulary generator", "meow translator"],
    jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: "CatScape Cat-verter", applicationCategory: "EntertainmentApplication", description: "AI tool that transforms text into cat-themed vocabulary and puns.", offers: { "@type": "Offer", price: "0", priceCurrency: "SGD" } },
  });

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const catVert = async (text?: string) => {
    const textToConvert = text || input;
    if (!textToConvert.trim()) return;

    if (text) setInput(text);
    setOutput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CATVERTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: textToConvert }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to cat-vert");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullOutput = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullOutput += content;
              setOutput(fullOutput);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast({ title: "Cat-astrophe! 😿", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied! 📋", description: "Cat-verted text copied to clipboard!" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-gradient-hero mb-3">🔄 The Cat-verter</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Trans-fur-m any boring hooman text into purr-fect cat vocabulary! Powered by AI meow-gic. ✨
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">📝 Hooman Text (boring!)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your boring hooman text here..."
            rows={5}
            className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-border focus:border-primary focus:outline-none font-body text-foreground placeholder:text-muted-foreground resize-none shadow-card"
          />
        </div>

        {/* Example buttons */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Or try an example:</p>
          <div className="flex flex-wrap gap-2">
            {exampleTexts.map((text, i) => (
              <button
                key={i}
                onClick={() => catVert(text)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                Example {i + 1} 🐾
              </button>
            ))}
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={() => catVert()}
          disabled={isLoading || !input.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-hero text-primary-foreground font-display font-bold text-lg shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-paw-bounce">🐱</span> Cat-verting...
            </>
          ) : (
            <>
              <Sparkles size={22} /> Cat-vert It! 🐾
            </>
          )}
        </button>

        {/* Output */}
        {(output || isLoading) && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">😸 Cat-verted Text (meow-velous!)</label>
              <div className="flex gap-2">
                {output && (
                  <>
                    <button onClick={copyOutput} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors" title="Copy">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button onClick={() => catVert()} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors" title="Regenerate">
                      <RotateCcw size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-card border-2 border-primary/20 shadow-card min-h-[120px]">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {output || <span className="text-muted-foreground animate-pulse">Summoning cat wisdom... 🐱✨</span>}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatVerter;
