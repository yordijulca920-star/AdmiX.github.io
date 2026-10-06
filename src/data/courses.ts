import type { Course, CourseId } from "@/lib/models/types";

export const COURSES: Course[] = [
  {
    id: "razonamiento",
    name: "Razonamiento Matemático",
    short: "RM",
    description: "Planteo, sucesiones, combinatoria y cálculo lógico para admisión.",
    topics: [
      { id: "planteo-ecuaciones", name: "Planteo de ecuaciones", blurb: "Traduce enunciados a ecuaciones." },
      { id: "problemas-edades", name: "Problemas de edades", blurb: "Relaciones temporales entre edades." },
      { id: "sucesiones", name: "Sucesiones", blurb: "Patrones numéricos y el término siguiente." },
      { id: "series", name: "Series", blurb: "Suma de términos de una sucesión." },
      { id: "arreglos-numericos", name: "Arreglos numéricos", blurb: "Cuadrados, tablas y figuras numéricas." },
      { id: "operadores", name: "Operadores matemáticos", blurb: "Operaciones definidas por símbolos." },
      { id: "analisis-combinatorio", name: "Análisis combinatorio", blurb: "Permutaciones, combinaciones y conteo." },
      { id: "probabilidades", name: "Probabilidades", blurb: "Casos favorables sobre casos posibles." },
      { id: "fracciones", name: "Fracciones", blurb: "Operaciones y problemas con fracciones." },
      { id: "porcentajes", name: "Porcentajes", blurb: "Aumentos, descuentos y partes porcentuales." },
    ],
  },
  {
    id: "fisica",
    name: "Física",
    short: "FIS",
    description: "Mecánica, energía y circuitos con el rigor de un examen de ingeniería.",
    topics: [
      { id: "cinematica", name: "Cinemática", blurb: "Movimiento, velocidad y desplazamiento." },
      { id: "mruv", name: "MRUV", blurb: "Movimiento rectilíneo uniformemente variado." },
      { id: "caida-libre", name: "Caída libre", blurb: "Caída y lanzamiento vertical. g = 10 m/s²." },
      { id: "estatica", name: "Estática", blurb: "Equilibrio de fuerzas y momentos." },
      { id: "dcl", name: "Diagramas de cuerpo libre", blurb: "Identifica fuerzas sobre un cuerpo." },
      { id: "dinamica", name: "Dinámica", blurb: "Leyes de Newton y aceleración." },
      { id: "rozamiento", name: "Rozamiento", blurb: "Fricción estática y cinética." },
      { id: "trabajo", name: "Trabajo", blurb: "W = F · d y trabajo neto." },
      { id: "potencia", name: "Potencia", blurb: "Potencia media e instantánea." },
      { id: "energia-mecanica", name: "Energía mecánica", blurb: "Cinética y potencial gravitatoria." },
      { id: "conservacion-energia", name: "Conservación de la energía", blurb: "Em se conserva si no hay pérdidas." },
      { id: "electrodinamica", name: "Electrodinámica", blurb: "Corriente, carga y ley de Ohm." },
      { id: "circuitos", name: "Circuitos y resistencias", blurb: "Serie, paralelo y equivalentes." },
    ],
  },
  {
    id: "algebra",
    name: "Álgebra",
    short: "ALG",
    description: "Exponentes, factorización, ecuaciones y funciones.",
    topics: [
      { id: "teoria-exponentes", name: "Teoría de exponentes", blurb: "Leyes de potencias y raíces." },
      { id: "productos-notables", name: "Productos notables", blurb: "Identidades algebraicas clásicas." },
      { id: "polinomios", name: "Polinomios", blurb: "Operaciones y estructura polinómica." },
      { id: "grados", name: "Grados", blurb: "Grado absoluto y relativo." },
      { id: "valor-numerico", name: "Valor numérico", blurb: "Evalúa una expresión en un punto." },
      { id: "factorizacion", name: "Factorización", blurb: "Factor común, diferencia de cuadrados y más." },
      { id: "aspa-simple", name: "Aspa simple", blurb: "Factoriza trinomios de la forma x² + bx + c." },
      { id: "aspa-doble", name: "Aspa doble", blurb: "Factoriza ax² + bx + c." },
      { id: "ruffini", name: "Ruffini", blurb: "División sintética de polinomios." },
      { id: "ecuaciones", name: "Ecuaciones", blurb: "Lineales, cuadráticas y racionales." },
      { id: "inecuaciones", name: "Inecuaciones", blurb: "Intervalos y desigualdades." },
      { id: "funciones", name: "Funciones", blurb: "Definición, evaluación y tipos." },
      { id: "dominio-rango", name: "Dominio y rango", blurb: "Conjuntos de partida y llegada." },
      { id: "graficas", name: "Gráficas", blurb: "Lectura de curvas y transformaciones." },
    ],
  },
  {
    id: "geometria",
    name: "Geometría",
    short: "GEO",
    description: "Figuras planas, congruencia, áreas y geometría del espacio.",
    topics: [
      { id: "triangulos", name: "Triángulos", blurb: "Clasificación, ángulos y lados." },
      { id: "lineas-notables", name: "Líneas notables", blurb: "Mediana, altura, bisectriz y mediatriz." },
      { id: "congruencia", name: "Congruencia", blurb: "Criterios LAL, ALA, LLL." },
      { id: "semejanza", name: "Semejanza", blurb: "Triángulos semejantes y proporcionalidad." },
      { id: "cuadrilateros", name: "Cuadriláteros", blurb: "Paralelogramos, trapecios y propiedades." },
      { id: "circunferencia", name: "Circunferencia", blurb: "Arcos, cuerdas y ángulos inscritos." },
      { id: "areas", name: "Áreas", blurb: "Áreas de figuras planas." },
      { id: "perimetros", name: "Perímetros", blurb: "Contornos y longitudes." },
      { id: "geometria-espacio", name: "Geometría del espacio", blurb: "Prisma, pirámide, cilindro y esfera." },
    ],
  },
  {
    id: "trigonometria",
    name: "Trigonometría",
    short: "TRI",
    description: "Razones, identidades y resolución de triángulos.",
    topics: [
      { id: "razones", name: "Razones trigonométricas", blurb: "sen, cos, tan en un triángulo rectángulo." },
      { id: "angulos", name: "Ángulos", blurb: "Sexagesimal, radial y conversión." },
      { id: "identidades", name: "Identidades trigonométricas", blurb: "Pitagóricas y recíprocas." },
      { id: "resolucion-triangulos", name: "Resolución de triángulos", blurb: "Leyes de senos y cosenos." },
      { id: "reduccion-primer-cuadrante", name: "Reducción al primer cuadrante", blurb: "Ángulos asociados y signos." },
      { id: "funciones-trig", name: "Funciones trigonométricas", blurb: "Periodo, rango y valores notables." },
    ],
  },
  {
    id: "aritmetica",
    name: "Aritmética",
    short: "ARI",
    description: "Números, divisibilidad, proporciones e interés.",
    topics: [
      { id: "numeros-naturales", name: "Números naturales", blurb: "Operaciones y propiedades básicas." },
      { id: "divisibilidad", name: "Divisibilidad", blurb: "Criterios y números primos." },
      { id: "mcd-mcm", name: "MCD y MCM", blurb: "Máximo común divisor y mínimo común múltiplo." },
      { id: "fracciones", name: "Fracciones", blurb: "Simplificar, sumar y comparar." },
      { id: "razones-proporciones", name: "Razones y proporciones", blurb: "Razón, proporción y media." },
      { id: "regla-de-tres", name: "Regla de tres", blurb: "Directa, inversa y compuesta." },
      { id: "porcentajes", name: "Porcentajes", blurb: "Tanto por ciento comercial y aritmético." },
      { id: "promedios", name: "Promedios", blurb: "Media aritmética y ponderada." },
      { id: "interes-simple", name: "Interés simple", blurb: "I = C · r · t." },
    ],
  },
];

export const COURSE_BY_ID: Record<CourseId, Course> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
) as Record<CourseId, Course>;

export function getCourse(id: string): Course | undefined {
  return COURSE_BY_ID[id as CourseId];
}

export function getTopic(courseId: string, topicId: string) {
  return getCourse(courseId)?.topics.find((t) => t.id === topicId);
}

export function topicKey(courseId: string, topicId: string) {
  return `${courseId}:${topicId}`;
}

export function allTopicCount() {
  return COURSES.reduce((n, c) => n + c.topics.length, 0);
}
