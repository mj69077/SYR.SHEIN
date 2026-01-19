import React, { useState } from 'react'

const MADHAB_NAMES = {
  hanafi: 'الحنفي',
  maliki: 'المالكي',
  shafii: 'الشافعي',
  hanbali: 'الحنبلي'
}

const MADHAB_COLORS = {
  hanafi: '#1a5f2a',
  maliki: '#8b4513',
  shafii: '#1e3a5f',
  hanbali: '#5d2e46'
}

export default function App() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [fatwa, setFatwa] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setFatwa(null)

    try {
      const response = await fetch('/api/ask-fatwa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      if (!response.ok) {
        throw new Error('فشل في الحصول على الفتوى')
      }

      const data = await response.json()
      setFatwa(data)
    } catch (err) {
      setError(err.message || 'حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>الفتاوى الشرعية</h1>
        <p style={styles.subtitle}>اسأل عن حكم شرعي واحصل على إجابة من المذاهب الأربعة</p>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اكتب سؤالك هنا... مثال: ما حكم صلاة الجماعة؟"
            style={styles.textarea}
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            style={{
              ...styles.button,
              opacity: loading || !question.trim() ? 0.6 : 1
            }}
          >
            {loading ? (
              <span><span className="spinner">◌</span> جاري البحث...</span>
            ) : (
              'احصل على الفتوى'
            )}
          </button>
        </form>

        {error && (
          <div style={styles.error}>
            <strong>خطأ:</strong> {error}
          </div>
        )}

        {fatwa && (
          <div style={styles.results}>
            <h2 style={styles.questionTitle}>السؤال: {fatwa.question}</h2>

            <div style={styles.madhabGrid}>
              {['hanafi', 'maliki', 'shafii', 'hanbali'].map((madhab) => (
                <div
                  key={madhab}
                  style={{
                    ...styles.madhabCard,
                    borderTopColor: MADHAB_COLORS[madhab]
                  }}
                >
                  <h3 style={{
                    ...styles.madhabTitle,
                    backgroundColor: MADHAB_COLORS[madhab]
                  }}>
                    المذهب {MADHAB_NAMES[madhab]}
                  </h3>
                  <div style={styles.madhabContent}>
                    <div style={styles.ruling}>
                      <strong>الحكم:</strong> {fatwa[madhab]?.ruling}
                    </div>
                    <div style={styles.explanation}>
                      <strong>الشرح:</strong> {fatwa[madhab]?.explanation}
                    </div>
                    <div style={styles.evidence}>
                      <strong>الدليل:</strong> {fatwa[madhab]?.evidence}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {fatwa.consensus && (
              <div style={styles.consensus}>
                <h3 style={styles.consensusTitle}>نقاط الاتفاق</h3>
                <p>{fatwa.consensus}</p>
              </div>
            )}

            {fatwa.note && (
              <div style={styles.note}>
                <strong>ملاحظة:</strong> {fatwa.note}
              </div>
            )}
          </div>
        )}

        {!fatwa && !loading && !error && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>🕌</div>
            <p>اكتب سؤالك الشرعي وسنقدم لك الإجابة من المذاهب الأربعة</p>
            <p style={styles.placeholderSubtext}>الحنفي • المالكي • الشافعي • الحنبلي</p>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>تنبيه: هذه الفتاوى للاسترشاد فقط، يرجى مراجعة أهل العلم للتأكد</p>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Amiri', 'Noto Naskh Arabic', serif"
  },
  header: {
    background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3318 100%)',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9
  },
  main: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px'
  },
  textarea: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    borderRadius: '10px',
    border: '2px solid #ddd',
    resize: 'vertical',
    fontFamily: 'inherit',
    direction: 'rtl'
  },
  button: {
    background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3318 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #fcc'
  },
  results: {
    marginTop: '20px'
  },
  questionTitle: {
    fontSize: '1.3rem',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px'
  },
  madhabGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  madhabCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    borderTop: '4px solid'
  },
  madhabTitle: {
    color: 'white',
    padding: '12px',
    margin: 0,
    fontSize: '1.1rem',
    textAlign: 'center'
  },
  madhabContent: {
    padding: '15px'
  },
  ruling: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px'
  },
  explanation: {
    marginBottom: '10px',
    lineHeight: 1.8
  },
  evidence: {
    fontStyle: 'italic',
    color: '#555',
    padding: '10px',
    backgroundColor: '#fff8e7',
    borderRadius: '5px'
  },
  consensus: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  consensusTitle: {
    color: '#1a5f2a',
    marginBottom: '10px'
  },
  note: {
    backgroundColor: '#fff3e0',
    padding: '15px',
    borderRadius: '10px',
    borderRight: '4px solid #ff9800'
  },
  placeholder: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  placeholderIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  placeholderSubtext: {
    marginTop: '10px',
    color: '#999'
  },
  footer: {
    backgroundColor: '#333',
    color: '#aaa',
    textAlign: 'center',
    padding: '15px',
    fontSize: '0.9rem'
  }
}
