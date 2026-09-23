import type { Faq } from "@/content/services";
import { Icon } from "@/components/ui/icon";

export function FaqList({ faqs, tone = "light" }: { faqs: readonly Faq[]; tone?: "light" | "dark" }) {
  const border = tone === "light" ? "border-ink-900/15" : "border-white/10";
  const body = tone === "light" ? "text-slate" : "text-mist";
  return (
    <div className={`border-t ${border}`}>
      {faqs.map((faq) => (
        <details key={faq.question} className={`group border-b ${border} py-6`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium sm:text-xl [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span className="mt-1 shrink-0 transition-transform duration-300 group-open:rotate-45">
              <Icon name="plus" size={22} />
            </span>
          </summary>
          <p className={`mt-4 max-w-3xl leading-relaxed ${body}`}>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
