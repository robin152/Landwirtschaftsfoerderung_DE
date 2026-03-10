export default function ProcessSection() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Detaillierter Prozess</h2>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="flex gap-6 p-6 bg-slate-50 rounded-lg border-2 border-slate-200">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600">
                  <span className="text-white font-bold">{num}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Schritt {num}</h3>
                <p className="text-slate-600 mt-1">Detaillierte Beschreibung für Schritt {num} wird hier eingefügt.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
