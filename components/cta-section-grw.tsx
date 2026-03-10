export default function CTASection() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Bereit für Ihre Gründung?</h2>
        <p className="text-lg text-slate-200">
          Kontaktieren Sie Patrick Starkmann für eine unverbindliche Beratung zur Regional-Förderung.
        </p>
        <button className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition inline-block">
          Jetzt Termin vereinbaren
        </button>
      </div>
    </section>
  )
}
