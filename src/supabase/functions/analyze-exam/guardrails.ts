const medicalTerms = [
  "examen",
  "resultado",
  "laboratorio",
  "sangre",
  "orina",
  "glucosa",
  "colesterol",
  "trigliceridos",
  "hemoglobina",
  "leucocitos",
  "plaquetas",
  "creatinina",
  "tsh",
  "t3",
  "t4",
  "vitamina",
  "rango",
  "alto",
  "bajo",
  "normal",
  "salud",
  "medico",
  "diagnostico",
  "sintoma",
];

const offTopicTerms = [
  "goku",
  "dragon ball",
  "naruto",
  "anime",
  "pelicula",
  "serie",
  "futbol",
  "programacion",
  "codigo",
  "receta",
  "historia",
  "capital",
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const isClearlyOffTopic = ({
  text,
  hasMedicalContext,
}: {
  text: string;
  hasMedicalContext: boolean;
}) => {
  const normalized = normalize(text);
  const mentionsMedicalTopic = medicalTerms.some((term) => normalized.includes(term));
  const hasOffTopicTerm = offTopicTerms.some((term) => normalized.includes(term));
  const wordCount = normalized.split(/\s+/).length;
  
  // If user explicitly mentions off-topic terms WITHOUT any medical mention, reject
  if (hasOffTopicTerm && !mentionsMedicalTopic && !hasMedicalContext) {
    return true;
  }
  
  // If it's very short (<=3 words) and has no medical mention, it's likely off-topic
  if (wordCount <= 3 && !mentionsMedicalTopic && !hasMedicalContext) {
    return true;
  }
  
  // If they mention medical topics or have a document, it's on-topic
  return false;
};

export const offTopicResponse =
  "Puedo ayudarte con exámenes médicos. Sube un examen o hazme una pregunta sobre tus resultados.";
