export default async function handler(req, res) {
    // Only allow POST requests
  if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
  }

  if (!question) {
        return res.status(400).json({ error: 'Question is required' });
  }

  try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                          'Content-Type': 'application/json',
                          'x-api-key': apiKey,
                          'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                          model: 'claude-opus-4-1-20250805',
                          max_tokens: 4000,
                          messages: [{
                                      role: 'user',
                                      content: `أنت عالم فقه إسلامي متخصص في المذاهب الأربعة. أجب عن السؤال التالي بالتفصيل من منظور كل مذهب من المذاهب السنية الأربعة.

                                      السؤال: ${question}

                                      أجب بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:
                                      {
                                        "question": "السؤال المطروح",
                                          "hanafi": {
                                              "ruling": "الحكم الشرعي",
                                                  "explanation": "الشرح والتفصيل مع الأدلة",
                                                      "evidence": "الدليل من القرآن أو السنة"
                                                        },
                                                          "maliki": {
                                                              "ruling": "الحكم الشرعي",
                                                                  "explanation": "الشرح والتفصيل مع الأدلة",
                                                                      "evidence": "الدليل من القرآن أو السنة"
                                                                        },
                                                                          "shafii": {
                                                                              "ruling": "الحكم الشرعي",
                                                                                  "explanation": "الشرح والتفصيل مع الأدلة",
                                                                                      "evidence": "الدليل من القرآن أو السنة"
                                                                                        },
                                                                                          "hanbali": {
                                                                                              "ruling": "الحكم الشرعي",
                                                                                                  "explanation": "الشرح والتفصيل مع الأدلة",
                                                                                                      "evidence": "الدليل من القرآن أو السنة"
                                                                                                        },
                                                                                                          "consensus": "نقاط الاتفاق بين المذاهب إن وجدت",
                                                                                                            "note": "ملاحظة عامة أو نصيحة"
                                                                                                            }`
                          }]
                }),
        });

      if (!response.ok) {
              const errorData = await response.json();
              console.error('Anthropic API error:', errorData);
              return res.status(response.status).json({ error: 'Failed to get response from AI' });
      }

      const data = await response.json();
        const text = data.content.map(item => item.text || '').join('');
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

      return res.status(200).json(parsed);
  } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'حدث خطأ في معالجة الطلب' });
  }
}
