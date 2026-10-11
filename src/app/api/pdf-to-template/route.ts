import { NextResponse } from 'next/server';

// Le prompt système qui force l'IA à respecter notre format exact de blocs.
const SYSTEM_PROMPT = `
Tu es un expert en design web et en extraction spatiale.
L'utilisateur souhaite reproduire LE PLUS FIDÈLEMENT POSSIBLE le PDF fourni, avec les textes, les illustrations et les couleurs EXACTEMENT à la même position que dans le document original.

Tu dois convertir le PDF en un template JSON avec UN SEUL bloc de type "custom", contenant des éléments positionnés en absolu (freeform).

Le JSON doit respecter strictement cette structure TypeScript :

{
  "name": "Nom du portfolio (déduit du PDF)",
  "globalStyle": {
    "primaryColor": "#HEX",
    "secondaryColor": "#HEX",
    "bgColor": "#HEX",
    "fontHeading": "nom de police",
    "fontBody": "nom de police",
    "borderRadius": "none" | "sm" | "md" | "lg" | "full",
    "darkMode": false
  },
  "blocks": [
    {
      "id": "block-freeform-1",
      "type": "custom",
      "content": {},
      "style": {
        "bgColor": "#HEX"
      },
      "layout": {
        "type": "freeform",
        "elements": [
          {
            "id": "element-1",
            "type": "text" | "image" | "shape" | "button",
            "content": "Le texte extrait",
            "url": "https://url-image-pertinente",
            "x": "pourcentage (ex: 10%)",
            "y": "valeur en pixels (ex: 150px)",
            "width": "pourcentage ou pixels",
            "height": "pourcentage ou pixels",
            "zIndex": 10,
            "style": {
              "color": "#HEX",
              "fontSize": "24px",
              "fontWeight": "bold",
              "backgroundColor": "transparent"
            }
          }
        ]
      }
    }
  ]
}

RÈGLES IMPORTANTES :
1. Renvoie UNIQUEMENT le JSON pur, sans balise markdown.
2. Tu DOIS générer un tableau "elements" détaillé avec les vrais textes du PDF, à leur position d'origine (x, y). 
3. Estime la hauteur totale de la page pour les "y".
4. Reproduis les couleurs du texte et de l'arrière-plan du PDF.
5. S'il y a des images, fournis des images Unsplash placeholders liées au thème, et place-les là où il y avait des images.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let base64Data = '';
    
    if (body.pdfUrl) {
      const fetchRes = await fetch(body.pdfUrl);
      if (!fetchRes.ok) throw new Error("Impossible de récupérer le PDF depuis le stockage.");
      const arrayBuffer = await fetchRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = buffer.toString('base64');
    } else {
      // Fallback for FormData if still used anywhere else
      const formData = await request.formData().catch(() => null);
      if (formData) {
        const file = formData.get('pdf') as File;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          base64Data = buffer.toString('base64');
        }
      }
    }

    if (!base64Data) {
      return NextResponse.json({ error: 'Aucun fichier PDF fourni (ni URL ni fichier).' }, { status: 400 });
    }

    // Clé API Gemini (Google) - À ajouter dans le .env
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // ---------------------------------------------------------
      // MOCK DE DÉVELOPPEMENT (Utilisé si pas de clé API)
      // ---------------------------------------------------------
      console.warn("⚠️ Clé GEMINI_API_KEY introuvable. Retour d'un mock pour tester l'UI.");
      
      // On simule un délai de réflexion de l'IA (2 secondes)
      await new Promise(r => setTimeout(r, 2000));

      return NextResponse.json({
        name: "Template généré depuis PDF (Mock)",
        globalStyle: {
          primaryColor: "#2563eb",
          secondaryColor: "#3b82f6",
          bgColor: "#f8fafc",
          fontHeading: "Inter",
          fontBody: "Roboto",
          borderRadius: "md",
          darkMode: false
        },
        blocks: [
          {
            id: "block-ai-1",
            type: "hero",
            content: {
              name: "Profil extrait du PDF",
              title: "Titre Détecté par IA",
              tagline: "Cette section a été générée automatiquement en mock.",
              cta: "Contact",
              imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
            },
            style: { bgColor: "#ffffff", textColor: "#0f172a", accentColor: "#2563eb", padding: "xl", align: "left", fontFamily: "Inter" },
            layout: { type: "split", imagePosition: "right", imageWidth: "50%" }
          },
          {
            id: "block-ai-2",
            type: "experience",
            content: {
              title: "Expériences (détectées)",
              job1: "Lead Developer",
              company1: "Tech Corp",
              period1: "2020 - 2023",
              desc1: "Développement d'applications web scalables."
            },
            style: { bgColor: "#f8fafc", textColor: "#0f172a", accentColor: "#2563eb", padding: "lg", align: "left", fontFamily: "Inter" },
            layout: { type: "default" }
          }
        ]
      });
    }

    // ---------------------------------------------------------
    // VÉRITABLE APPEL À L'IA GEMINI (Support natif des PDF)
    // ---------------------------------------------------------
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: SYSTEM_PROMPT },
            { inline_data: { mime_type: 'application/pdf', data: base64Data } }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
        }
      })
    });

    const aiData = await response.json();
    
    // Si l'API Gemini renvoie une erreur (clé invalide, erreur 400, etc.)
    if (!response.ok || !aiData.candidates) {
      console.error("Erreur de l'API Gemini :", aiData);
      return NextResponse.json({ 
        error: "Erreur de l'API Gemini. Vérifiez votre clé API.",
        details: aiData.error?.message || "Erreur inconnue"
      }, { status: 500 });
    }

    const rawText = aiData.candidates[0].content.parts[0].text;
    
    // Nettoyage Markdown
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const templateData = JSON.parse(cleanJson);

    return NextResponse.json(templateData);

  } catch (error) {
    console.error("Erreur lors de l'analyse IA du PDF :", error);
    return NextResponse.json({ error: "Échec de l'analyse du PDF" }, { status: 500 });
  }
}
