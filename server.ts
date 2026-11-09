import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI Finance Advisor Endpoint
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { userPrompt, budgetSummary } = req.body;

    if (!aiClient) {
      // Fallback response if GEMINI_API_KEY is not set
      return res.json({
        success: true,
        source: 'rule-based',
        advice: [
          {
            title: 'Revisión urgente de la factura de Luz (Endesa)',
            action: 'Solicita la tarifa discriminación horaria de 3 periodos o tarifa PVPC regulada.',
            estimatedSavingsYearly: 240,
            category: 'Suministros',
          },
          {
            title: 'Optimización de compra semanal en Supermercado',
            action: 'Planifica 5 menús con ingredientes compartidos (legumbres y verdura de temporada). Reduce compras sin lista.',
            estimatedSavingsYearly: 480,
            category: 'Variables',
          },
          {
            title: 'Consolidador de Seguros de Hogar y Vehículo',
            action: 'Agrupa el seguro del SUV y del piso con la misma aseguradora para obtener hasta un 15% de bonificación familiar.',
            estimatedSavingsYearly: 160,
            category: 'Gastos Fijos',
          },
        ],
        summaryText: 'Basado en tu presupuesto actual de 3.450€ de ingresos y 2.182€ de gastos, puedes liberar hasta 880€ adicionales al año sin sacrificar tu calidad de vida.',
      });
    }

    const systemInstruction = `Eres un economista experto en finanzas domésticas de habla hispana y asesor oficial de "Gestor Casa Pro".
Analiza los datos del presupuesto familiar y responde con consejos hiper-concretos, amables, realistas y motivadores.
Devuelve SIEMPRE una respuesta en formato JSON estricto con la siguiente estructura:
{
  "summaryText": "Resumen ejecutivo de 2 frases con tono cercano y profesional.",
  "advice": [
    {
      "title": "Título corto y directo",
      "action": "Explicación práctica de 1-2 frases sobre cómo implementarlo hoy",
      "estimatedSavingsYearly": número_estimado_en_euros,
      "category": "Suministros" | "Variables" | "Gastos Fijos" | "Ahorro"
    }
  ]
}`;

    const promptText = `
Datos de la Familia:
- Ingresos mensuales: ${budgetSummary?.income || 3450}€
- Gastos fijos (hipoteca, seguros, IBI, subscripciones): ${budgetSummary?.fixed || 958}€
- Suministros (Luz, Agua, Internet, Gas): ${budgetSummary?.utilities || 194}€
- Gastos variables (Súper, Gasolina, Ocio): ${budgetSummary?.variable || 745}€
- Ahorro actual en La Hucha: ${budgetSummary?.savings || 8450}€

Consulta o meta del usuario: "${userPrompt || '¿Qué 3 acciones rápidas puedo hacer este mes para recortar gastos sin sufrir?'}"
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const contentText = response.text;
    if (contentText) {
      const parsed = JSON.parse(contentText);
      return res.json({
        success: true,
        source: 'gemini-ai',
        ...parsed,
      });
    } else {
      throw new Error('No output from Gemini');
    }
  } catch (err: any) {
    console.error('AI Advisor error:', err);
    return res.json({
      success: true,
      source: 'fallback-error',
      summaryText: 'Recomendación express de economía doméstica: Revisa tus subscripciones y contratos de luz antes de final de mes.',
      advice: [
        {
          title: 'Revisa tarifas de Luz y Gas',
          action: 'Solicita la tarifa regulada TUR para calefacción y PVPC para luz.',
          estimatedSavingsYearly: 320,
          category: 'Suministros',
        },
        {
          title: 'Menú semanal planificado',
          action: 'Reduce un 10% el gasto en alimentación comprando marcas blancas de calidad.',
          estimatedSavingsYearly: 360,
          category: 'Variables',
        },
      ],
    });
  }
});

// Mount Vite middleware in dev or serve dist in prod
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html><html><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Gestor Casa Pro] Server running on http://localhost:${PORT}`);
  });
}

setupServer();
