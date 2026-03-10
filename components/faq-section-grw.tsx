export default function FAQSection() {
  const faqs = [
    { question: "Wer kann die Regional-Förderung beantragen?", answer: "Antwort wird hier eingefügt." },
    { question: "Wie hoch ist der maximale Zuschuss?", answer: "Bis zu 200.000€ je nach Situation." },
    { question: "Wie lange dauert die Bearbeitung?", answer: "Die Bearbeitungsdauer wird hier erklärt." },
    { question: "Welche Unterlagen sind erforderlich?", answer: "Die erforderlichen Unterlagen werden aufgelistet." },
  ]

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Häufig gestellte Fragen</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border-2 border-slate-200 rounded-lg">
              <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-slate-900 hover:bg-slate-50">
                {faq.question}
                <span className="text-teal-600 transition group-open:rotate-180">▼</span>
              </summary>
              <p className="border-t border-slate-200 p-6 text-slate-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
