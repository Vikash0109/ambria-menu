const STEPS = [
  { number: 1, label: 'Event Details'   },
  { number: 2, label: 'Select Menu'     },
  { number: 3, label: 'Services'        },
  { number: 4, label: 'Review & Submit' },
]

export default function StepBar({ activeStep }) {
  return (
    <div style={{ background: '#0f0f0f', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-0 py-3">
          {STEPS.map((step, idx) => {
            const done   = step.number < activeStep
            const active = step.number === activeStep

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  {/* Circle */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
                    style={
                      done
                        ? { background: '#c9a84c', color: '#0f0f0f' }
                        : active
                          ? { background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#0f0f0f', boxShadow: '0 0 12px rgba(201,168,76,0.4)' }
                          : { background: '#1e1e1e', color: '#7a6a50', border: '1px solid #3a3020' }
                    }
                  >
                    {done ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.number}
                  </div>

                  {/* Label */}
                  <span
                    className="text-xs whitespace-nowrap hidden sm:block tracking-wide"
                    style={{
                      fontFamily: 'inherit',
                      color: done ? '#c9a84c' : active ? '#e8c55a' : '#7a6a4a',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div
                    className="mx-2 sm:mx-3 h-px w-8 sm:w-14 shrink-0 transition-all"
                    style={{ background: step.number < activeStep ? '#c9a84c' : '#2e2416' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
