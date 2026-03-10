export default function EligibilitySection() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Fördervoraussetzungen</h2>
        <div className="bg-white p-8 rounded-lg border-2 border-slate-200">
          <p className="text-slate-700 leading-relaxed mb-6">
            Voraussetzungen und Anforderungen für die Regional-Förderung werden hier eingefügt.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mt-2"></span>
              <span className="text-slate-700">Requirement 1</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mt-2"></span>
              <span className="text-slate-700">Requirement 2</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-2 h-2 bg-teal-600 rounded-full mt-2"></span>
              <span className="text-slate-700">Requirement 3</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
