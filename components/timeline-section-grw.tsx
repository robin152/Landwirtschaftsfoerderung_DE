export default function TimelineSection() {
  const steps = [
    { number: "1", title: "Beratung", description: "Kostenlose Erstberatung" },
    { number: "2", title: "Planung", description: "Businessplan erarbeiten" },
    { number: "3", title: "Antrag", description: "Förderantrag einreichen" },
    { number: "4", title: "Bewilligung", description: "Förderung erhalten" },
  ]

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Ablauf in 4 Schritten</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center">{step.title}</h3>
                <p className="text-slate-600 text-center text-sm mt-2">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-teal-300 -z-10 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
