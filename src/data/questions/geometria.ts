import type { Question } from "@/lib/models/types";
import { makeRng, nOptions, optionsAround, pick, q, randint, type Rng } from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `geometria:${topic}:${seed}:${i}`;
}

export function generateGeometria(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + 503);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(one(topicId, rng, i, seed));
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "triangulos":
      return triangulos(rng, i, seed);
    case "lineas-notables":
      return notables(rng, i, seed);
    case "congruencia":
      return congruencia(rng, i, seed);
    case "semejanza":
      return semejanza(rng, i, seed);
    case "cuadrilateros":
      return cuadrilateros(rng, i, seed);
    case "circunferencia":
      return circunferencia(rng, i, seed);
    case "areas":
      return areas(rng, i, seed);
    case "perimetros":
      return perimetros(rng, i, seed);
    case "geometria-espacio":
      return espacio(rng, i, seed);
    default:
      return triangulos(rng, i, seed);
  }
}

function triangulos(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "180°", ["90°", "360°", "270°", "120°"]);
    return q("geometria", "triangulos", "La suma de los ángulos internos de un triángulo es:", options, correctIndex, "En geometría euclidiana, α+β+γ = 180°.", 1, id("triangulos", i, seed));
  }
  if (kind === 1) {
    const a = pick(rng, [40, 50, 55, 70]);
    const b = pick(rng, [30, 40, 45, 60]);
    const c = 180 - a - b;
    const { options, correctIndex } = optionsAround(rng, c);
    return q("geometria", "triangulos", `Un triángulo tiene ángulos ${a}° y ${b}°. El tercero mide:`, options, correctIndex, `180 − ${a} − ${b} = ${c}°.`, 1, id("triangulos", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Isósceles", ["Equilátero", "Escaleno", "Rectángulo", "Obtusángulo"]);
    return q("geometria", "triangulos", "Un triángulo con exactamente dos lados iguales se llama:", options, correctIndex, "Isósceles: dos lados iguales (y dos ángulos iguales).", 1, id("triangulos", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Pitágoras: a² + b² = c²", ["a + b = c", "a² − b² = c", "sen a = c", "a = b = c"]);
  return q("geometria", "triangulos", "En un triángulo rectángulo, los catetos a, b y la hipotenusa c cumplen:", options, correctIndex, "Teorema de Pitágoras.", 1, id("triangulos", i, seed));
}

function notables(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "Del vértice al punto medio del lado opuesto", ["Perpendicular al lado opuesto", "Biseca el ángulo", "Pasa por el circuncentro", "Es siempre altura"]);
    return q("geometria", "lineas-notables", "La mediana de un triángulo va:", options, correctIndex, "Une un vértice con el punto medio del lado opuesto. Se cortan en el baricentro.", 2, id("lineas-notables", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Baricentro", ["Incentro", "Circuncentro", "Ortocentro", "Excentro"]);
    return q("geometria", "lineas-notables", "Las medianas se cortan en el:", options, correctIndex, "Baricentro (centro de gravedad), a 2/3 desde el vértice.", 2, id("lineas-notables", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Incentro", ["Baricentro", "Ortocentro", "Circuncentro", "Punto medio"]);
    return q("geometria", "lineas-notables", "Las bisectrices se cortan en el:", options, correctIndex, "Incentro: centro de la circunferencia inscrita.", 2, id("lineas-notables", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Ortocentro", ["Baricentro", "Incentro", "Circuncentro", "Centroide"]);
  return q("geometria", "lineas-notables", "Las alturas se cortan en el:", options, correctIndex, "Ortocentro.", 2, id("lineas-notables", i, seed));
}

function congruencia(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "LAL, ALA y LLL", ["Solo LLL", "AAA", "LL y A", "SAA siempre"]);
    return q("geometria", "congruencia", "Criterios clásicos de congruencia de triángulos:", options, correctIndex, "Lado-ángulo-lado, ángulo-lado-ángulo y lado-lado-lado. AAA no basta (eso es semejanza).", 2, id("congruencia", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Sus lados y ángulos correspondientes son iguales", ["Solo los ángulos", "Solo el área", "Tienen la misma forma pero distinta escala", "Comparten un vértice"]);
    return q("geometria", "congruencia", "Dos triángulos congruentes tienen:", options, correctIndex, "Misma forma y mismo tamaño: lados y ángulos correspondientes iguales.", 1, id("congruencia", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "No, AAA implica semejanza, no congruencia", ["Sí, siempre", "Solo si son rectángulos", "Solo si son isósceles", "Sí, si hay un lado"]);
  return q("geometria", "congruencia", "¿AAA es criterio de congruencia?", options, correctIndex, "Tres ángulos iguales → semejanza. Falta la escala (un lado).", 2, id("congruencia", i, seed));
}

function semejanza(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "6", ["4", "8", "9", "3"]);
    return q("geometria", "semejanza", "Triángulos semejantes de razón 2:3. El menor tiene un lado 4. El correspondiente del mayor mide:", options, correctIndex, "4 × 3/2 = 6.", 2, id("semejanza", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "El cuadrado de la razón de semejanza", ["La misma razón", "El cubo de la razón", "La mitad", "No se relacionan"]);
    return q("geometria", "semejanza", "La razón de las áreas de dos triángulos semejantes es:", options, correctIndex, "Áreas escalan con k².", 3, id("semejanza", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "AA (dos ángulos iguales)", ["Un solo lado", "Un solo ángulo", "Perímetros iguales", "Un área igual"]);
  return q("geometria", "semejanza", "Un criterio suficiente de semejanza es:", options, correctIndex, "Si dos ángulos coinciden, el tercero también (AA).", 2, id("semejanza", i, seed));
}

function cuadrilateros(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "360°", ["180°", "90°", "540°", "270°"]);
    return q("geometria", "cuadrilateros", "La suma de ángulos internos de un cuadrilátero convexo es:", options, correctIndex, "(4−2)×180° = 360°.", 1, id("cuadrilateros", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Un rectángulo con todos los lados iguales", ["Un rombo sin ángulos rectos", "Un trapecio isósceles", "Un paralelogramo cualquiera", "Un deltoide"]);
    return q("geometria", "cuadrilateros", "Un cuadrado es:", options, correctIndex, "Rectángulo (ángulos de 90°) y rombo (lados iguales) a la vez.", 1, id("cuadrilateros", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Lados opuestos paralelos", ["Solo un par de lados paralelos", "Ángulos de 90°", "Diagonales desiguales siempre", "Lados consecutivos iguales"]);
    return q("geometria", "cuadrilateros", "Un paralelogramo tiene:", options, correctIndex, "Dos pares de lados paralelos (y opuestos iguales).", 1, id("cuadrilateros", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Exactamente un par de lados paralelos", ["Dos pares", "Ningún par", "Todos los lados iguales", "Diagonales perpendiculares siempre"]);
  return q("geometria", "cuadrilateros", "Un trapecio (definición usual) tiene:", options, correctIndex, "Un par de lados paralelos (bases).", 2, id("cuadrilateros", i, seed));
}

function circunferencia(rng: Rng, i: number, seed: number): Question {
  const r = pick(rng, [3, 4, 5, 6, 7, 10]);
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, `${2 * r}π`, [`${r}π`, `${r * r}π`, `${2 * r}`, `${r * r}`]);
    return q("geometria", "circunferencia", `Longitud de una circunferencia de radio ${r}:`, options, correctIndex, "L = 2πr.", 1, id("circunferencia", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "La mitad del ángulo central que subtende el mismo arco", ["El doble", "Igual", "90° siempre", "Complementario"]);
    return q("geometria", "circunferencia", "Un ángulo inscrito mide:", options, correctIndex, "Ángulo inscrito = mitad del central que abarca el mismo arco.", 2, id("circunferencia", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "90°", ["45°", "60°", "180°", "120°"]);
    return q("geometria", "circunferencia", "El ángulo inscrito que abarca un diámetro mide:", options, correctIndex, "Arco de 180° → inscrito 90°. (Teorema de Tales).", 2, id("circunferencia", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, String(2 * r), [String(r), String(r * r), String(Math.round(2 * Math.PI * r)), String(r + 2)]);
  return q("geometria", "circunferencia", `El diámetro de una circunferencia de radio ${r} es:`, options, correctIndex, "d = 2r.", 1, id("circunferencia", i, seed));
}

function areas(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const b = pick(rng, [6, 8, 10, 12]);
    const h = pick(rng, [3, 4, 5, 6]);
    const a = (b * h) / 2;
    const { options, correctIndex } = optionsAround(rng, a);
    return q("geometria", "areas", `Área de un triángulo de base ${b} y altura ${h}:`, options, correctIndex, `A = bh/2 = ${a}.`, 1, id("areas", i, seed));
  }
  if (kind === 1) {
    const l = pick(rng, [4, 5, 6, 8, 10]);
    const { options, correctIndex } = optionsAround(rng, l * l);
    return q("geometria", "areas", `Área de un cuadrado de lado ${l}:`, options, correctIndex, `A = L² = ${l * l}.`, 1, id("areas", i, seed));
  }
  if (kind === 2) {
    const r = pick(rng, [3, 4, 5, 6]);
    const { options, correctIndex } = nOptions(rng, `${r * r}π`, [`${2 * r}π`, `${r}π`, String(r * r), `${2 * r}`]);
    return q("geometria", "areas", `Área de un círculo de radio ${r}:`, options, correctIndex, "A = πr².", 1, id("areas", i, seed));
  }
  const b = pick(rng, [6, 8, 10]);
  const h = pick(rng, [3, 4, 5]);
  const { options, correctIndex } = optionsAround(rng, b * h);
  return q("geometria", "areas", `Área de un rectángulo ${b} × ${h}:`, options, correctIndex, `A = ${b}·${h} = ${b * h}.`, 1, id("areas", i, seed));
}

function perimetros(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const l = pick(rng, [4, 5, 6, 8, 9]);
    const { options, correctIndex } = optionsAround(rng, 4 * l);
    return q("geometria", "perimetros", `Perímetro de un cuadrado de lado ${l}:`, options, correctIndex, `P = 4L = ${4 * l}.`, 1, id("perimetros", i, seed));
  }
  if (kind === 1) {
    const a = pick(rng, [3, 4, 5]);
    const b = pick(rng, [6, 7, 8]);
    const { options, correctIndex } = optionsAround(rng, 2 * (a + b));
    return q("geometria", "perimetros", `Perímetro de un rectángulo ${a} × ${b}:`, options, correctIndex, `P = 2(${a}+${b}) = ${2 * (a + b)}.`, 1, id("perimetros", i, seed));
  }
  const a = 3;
  const b = 4;
  const c = 5;
  const { options, correctIndex } = optionsAround(rng, a + b + c);
  return q("geometria", "perimetros", `Perímetro del triángulo 3-4-5:`, options, correctIndex, "3+4+5 = 12.", 1, id("perimetros", i, seed));
}

function espacio(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const a = pick(rng, [2, 3, 4, 5]);
    const { options, correctIndex } = optionsAround(rng, a * a * a);
    return q("geometria", "geometria-espacio", `Volumen de un cubo de arista ${a}:`, options, correctIndex, `V = a³ = ${a ** 3}.`, 1, id("geometria-espacio", i, seed));
  }
  if (kind === 1) {
    const r = pick(rng, [3, 4, 5]);
    const h = pick(rng, [6, 8, 10]);
    const { options, correctIndex } = nOptions(rng, `${r * r * h}π`, [`${2 * r * h}π`, `${r * h}π`, String(r * r * h), `${r * r}π`]);
    return q("geometria", "geometria-espacio", `Volumen de un cilindro r=${r}, h=${h}:`, options, correctIndex, "V = πr²h.", 2, id("geometria-espacio", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "6", ["4", "8", "12", "5"]);
    return q("geometria", "geometria-espacio", "Un cubo tiene caras:", options, correctIndex, "6 caras cuadradas, 12 aristas, 8 vértices.", 1, id("geometria-espacio", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "(4/3)πr³", ["4πr²", "πr²h", "(1/3)πr²h", "2πr"]);
  return q("geometria", "geometria-espacio", "El volumen de una esfera es:", options, correctIndex, "V = 4/3 π r³. El área es 4πr².", 2, id("geometria-espacio", i, seed));
}
