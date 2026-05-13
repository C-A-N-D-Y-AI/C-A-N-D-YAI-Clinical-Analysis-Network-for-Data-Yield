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
  if (hasMedicalContext) return false;

  const normalized = normalize(text);
  const mentionsMedicalTopic = medicalTerms.some((term) => normalized.includes(term));
  if (mentionsMedicalTopic) return false;

  return offTopicTerms.some((term) => normalized.includes(term)) || normalized.split(/\s+/).length <= 8;
};

export const offTopicResponse =
  "Puedo ayudarte con exámenes médicos. Sube un examen o hazme una pregunta sobre tus resultados.";
