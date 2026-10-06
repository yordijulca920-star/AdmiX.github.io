import type { Question } from "@/lib/models/types";
import { makeRng, nOptions, q, randint, type Rng } from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `trigonometria:${topic}:${seed}:${i}`;
}

export function generateTrigonometria(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + 809);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(one(topicId, rng, i, seed));
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "razones":
      return razones(rng, i, seed);
    case "angulos":
      return angulos(rng, i, seed);
    case "identidades":
      return identidades(rng, i, seed);
    case "resolucion-triangulos":
      return resolucion(rng, i, seed);
    case "reduccion-primer-cuadrante":
      return reduccion(rng, i, seed);
    case "funciones-trig":
      return funciones(rng, i, seed);
    default:
      return razones(rng, i, seed);
  }
}

function razones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "cateto opuesto / hipotenusa", ["adyacente / hipotenusa", "opuesto / adyacente", "hipotenusa / opuesto", "adyacente / opuesto"]);
    return q("trigonometria", "razones", "sen θ en un triángulo rectángulo es:", options, correctIndex, "SOH: seno = opuesto / hipotenusa.", 1, id("razones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "3/5", ["4/5", "3/4", "5/3", "4/3"]);
    return q("trigonometria", "razones", "En un triángulo 3-4-5, sen del ángulo opuesto al lado 3 es:", options, correctIndex, "opuesto 3, hipotenusa 5 → 3/5.", 2, id("razones", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "4/3", ["3/4", "3/5", "4/5", "5/4"]);
    return q("trigonometria", "razones", "En un 3-4-5, tan del ángulo opuesto al 4 es:", options, correctIndex, "tan = opuesto/adyacente = 4/3.", 2, id("razones", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "1/2", ["√2/2", "√3/2", "1", "0"]);
  return q("trigonometria", "razones", "sen 30° =", options, correctIndex, "Valor notable: sen 30° = 1/2.", 1, id("razones", i, seed));
}

function angulos(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "π rad", ["2π rad", "π/2 rad", "180 rad", "1 rad"]);
    return q("trigonometria", "angulos", "180° equivalen a:", options, correctIndex, "π rad = 180°.", 1, id("angulos", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "90°", ["45°", "60°", "180°", "30°"]);
    return q("trigonometria", "angulos", "π/2 radianes son:", options, correctIndex, "π/2 × 180/π = 90°.", 1, id("angulos", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "π/3", ["π/6", "π/4", "π/2", "2π/3"]);
    return q("trigonometria", "angulos", "60° en radianes es:", options, correctIndex, "60 × π/180 = π/3.", 2, id("angulos", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "360°", ["180°", "90°", "2π °", "100°"]);
  return q("trigonometria", "angulos", "Una vuelta completa mide:", options, correctIndex, "360° o 2π radianes.", 1, id("angulos", i, seed));
}

function identidades(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "1", ["0", "sen 2θ", "2", "tan θ"]);
    return q("trigonometria", "identidades", "sen²θ + cos²θ =", options, correctIndex, "Identidad pitagórica fundamental.", 1, id("identidades", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "sen θ / cos θ", ["cos/sen", "1/sen", "1/cos", "sen·cos"]);
    return q("trigonometria", "identidades", "tan θ =", options, correctIndex, "tangente = seno / coseno (cos ≠ 0).", 1, id("identidades", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "1 + tan²θ", ["1 − tan²θ", "sen²θ", "2 tan θ", "sec θ"]);
    return q("trigonometria", "identidades", "sec²θ =", options, correctIndex, "1 + tan²θ = sec²θ.", 2, id("identidades", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "1 / sen θ", ["1/cos", "cos/sen", "sen", "1/tan"]);
  return q("trigonometria", "identidades", "csc θ =", options, correctIndex, "Cosecante es el recíproco del seno.", 2, id("identidades", i, seed));
}

function resolucion(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "a / sen A = b / sen B = c / sen C", ["a sen A = b sen B", "a² = b² + c²", "a/b = sen A", "a + b = c"]);
    return q("trigonometria", "resolucion-triangulos", "La ley de senos afirma:", options, correctIndex, "Lado sobre seno del ángulo opuesto es constante (2R).", 2, id("resolucion-triangulos", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "c² = a² + b² − 2ab cos C", ["c² = a² + b² + 2ab cos C", "c = a + b − cos C", "c² = a² − b²", "cos C = a/b"]);
    return q("trigonometria", "resolucion-triangulos", "La ley de cosenos es:", options, correctIndex, "Generaliza Pitágoras.", 2, id("resolucion-triangulos", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "5", ["6", "7", "4", "√12"]);
  return q("trigonometria", "resolucion-triangulos", "Triángulo rectángulo, catetos 3 y 4. Hipotenusa:", options, correctIndex, "√(9+16)=5.", 1, id("resolucion-triangulos", i, seed));
}

function reduccion(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "sen 30°", ["−sen 30°", "cos 30°", "sen 150° distinto", "1"]);
    return q("trigonometria", "reduccion-primer-cuadrante", "sen 150° =", options, correctIndex, "150° = 180°−30°, seno positivo en II: sen 30° = 1/2.", 2, id("reduccion-primer-cuadrante", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "−cos 40°", ["cos 40°", "sen 40°", "−sen 40°", "cos 140° positivo"]);
    return q("trigonometria", "reduccion-primer-cuadrante", "cos 140° =", options, correctIndex, "140° = 180°−40°, coseno negativo en II.", 2, id("reduccion-primer-cuadrante", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Todos positivos", ["Solo sen", "Solo cos", "Solo tan", "Ninguno"]);
    return q("trigonometria", "reduccion-primer-cuadrante", "En el primer cuadrante:", options, correctIndex, "sen, cos y tan son positivos. (Regla ASTC / todos-seno-tangente-coseno).", 1, id("reduccion-primer-cuadrante", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "−1", ["1", "0", "√2/2", "1/2"]);
  return q("trigonometria", "reduccion-primer-cuadrante", "cos 180° =", options, correctIndex, "Coseno de π es −1.", 1, id("reduccion-primer-cuadrante", i, seed));
}

function funciones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "2π", ["π", "π/2", "1", "360"]);
    return q("trigonometria", "funciones-trig", "El periodo de sen x (x en radianes) es:", options, correctIndex, "sen(x+2π)=sen x.", 2, id("funciones-trig", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "[−1, 1]", ["ℝ", "[0, 1]", "(−1, 1)", "[0, π]"]);
    return q("trigonometria", "funciones-trig", "El rango de y = cos x es:", options, correctIndex, "Coseno oscila entre −1 y 1.", 1, id("funciones-trig", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "π", ["2π", "π/2", "1", "90"]);
    return q("trigonometria", "funciones-trig", "El periodo de tan x es:", options, correctIndex, "tan(x+π)=tan x. Asíntotas en π/2 + kπ.", 2, id("funciones-trig", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "0", ["1", "−1", "indefinido", "π"]);
  return q("trigonometria", "funciones-trig", "sen 0° =", options, correctIndex, "sen 0 = 0.", 1, id("funciones-trig", i, seed));
}
