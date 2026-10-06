import type { Question } from "@/lib/models/types";
import { gcd, lcm, makeRng, nOptions, optionsAround, pick, q, randint, type Rng } from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `aritmetica:${topic}:${seed}:${i}`;
}

export function generateAritmetica(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + 311);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(one(topicId, rng, i, seed));
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "numeros-naturales":
      return naturales(rng, i, seed);
    case "divisibilidad":
      return divisibilidad(rng, i, seed);
    case "mcd-mcm":
      return mcdmcm(rng, i, seed);
    case "fracciones":
      return fracciones(rng, i, seed);
    case "razones-proporciones":
      return razones(rng, i, seed);
    case "regla-de-tres":
      return regla(rng, i, seed);
    case "porcentajes":
      return porcentajes(rng, i, seed);
    case "promedios":
      return promedios(rng, i, seed);
    case "interes-simple":
      return interes(rng, i, seed);
    default:
      return naturales(rng, i, seed);
  }
}

function naturales(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const a = randint(rng, 12, 40);
    const b = randint(rng, 5, 18);
    const { options, correctIndex } = optionsAround(rng, a * b);
    return q("aritmetica", "numeros-naturales", `${a} × ${b} =`, options, correctIndex, `${a} × ${b} = ${a * b}.`, 1, id("numeros-naturales", i, seed));
  }
  if (kind === 1) {
    const b = randint(rng, 4, 12);
    const qot = randint(rng, 5, 15);
    const a = b * qot;
    const { options, correctIndex } = optionsAround(rng, qot);
    return q("aritmetica", "numeros-naturales", `${a} ÷ ${b} =`, options, correctIndex, `${a} / ${b} = ${qot}.`, 1, id("numeros-naturales", i, seed));
  }
  if (kind === 2) {
    const n = randint(rng, 8, 25);
    const { options, correctIndex } = optionsAround(rng, n * n);
    return q("aritmetica", "numeros-naturales", `${n}² =`, options, correctIndex, `${n} × ${n} = ${n * n}.`, 1, id("numeros-naturales", i, seed));
  }
  const n = randint(rng, 5, 12);
  const { options, correctIndex } = optionsAround(rng, n * (n + 1));
  return q("aritmetica", "numeros-naturales", `El producto de ${n} y el siguiente natural es:`, options, correctIndex, `${n} × ${n + 1} = ${n * (n + 1)}.`, 1, id("numeros-naturales", i, seed));
}

function divisibilidad(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "Si la suma de sus cifras es múltiplo de 3", [
      "Si termina en 0 o 5",
      "Si es par",
      "Si termina en 0",
      "Si la última cifra es 3",
    ]);
    return q("aritmetica", "divisibilidad", "Un número es divisible por 3 si y solo si:", options, correctIndex, "Criterio de divisibilidad por 3: la suma de cifras es múltiplo de 3.", 1, id("divisibilidad", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Si termina en 0 o 5", ["Si es par", "Si suma de cifras es 5", "Si termina en 2", "Si es impar"]);
    return q("aritmetica", "divisibilidad", "Un número es divisible por 5 si:", options, correctIndex, "Debe terminar en 0 o en 5.", 1, id("divisibilidad", i, seed));
  }
  if (kind === 2) {
    const n = pick(rng, [24, 36, 48, 60, 72]);
    const { options, correctIndex } = nOptions(rng, "Sí", ["No", "Solo por 2", "Solo por 3", "No se puede saber"]);
    return q("aritmetica", "divisibilidad", `¿${n} es divisible por 6?`, options, correctIndex, `${n} es par y la suma de cifras es múltiplo de 3, luego es divisible por 2 y 3, por tanto por 6.`, 2, id("divisibilidad", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "2, 3 y 5", ["Solo 2 y 5", "2, 4 y 5", "3 y 7", "2 y 9"]);
  return q("aritmetica", "divisibilidad", "Los únicos primos que dividen a 30 son:", options, correctIndex, "30 = 2 × 3 × 5.", 2, id("divisibilidad", i, seed));
}

function mcdmcm(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 6, 24);
  const b = randint(rng, 6, 24);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const g = gcd(a, b);
    const { options, correctIndex } = optionsAround(rng, g);
    return q("aritmetica", "mcd-mcm", `MCD(${a}, ${b}) =`, options, correctIndex, `El máximo común divisor de ${a} y ${b} es ${g}.`, 2, id("mcd-mcm", i, seed));
  }
  if (kind === 1) {
    const m = lcm(a, b);
    const { options, correctIndex } = optionsAround(rng, m);
    return q("aritmetica", "mcd-mcm", `MCM(${a}, ${b}) =`, options, correctIndex, `MCM(a,b) = a·b / MCD. ${a}·${b}/${gcd(a, b)} = ${m}.`, 2, id("mcd-mcm", i, seed));
  }
  const g = gcd(a, b);
  const { options, correctIndex } = nOptions(rng, String(a * b), [String(g), String(lcm(a, b)), String(a + b), String(Math.abs(a - b))]);
  return q("aritmetica", "mcd-mcm", `MCD(${a},${b}) × MCM(${a},${b}) es igual a:`, options, correctIndex, "Siempre MCD·MCM = a·b = " + a * b + ".", 3, id("mcd-mcm", i, seed));
}

function fracciones(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 1, 7);
  const b = randint(rng, a + 1, 12);
  const g = gcd(a, b);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const ans = `${a / g}/${b / g}`;
    const { options, correctIndex } = nOptions(rng, ans, [`${a}/${b}`, `${b}/${a}`, `${a / g}/${b}`, "1"]);
    return q("aritmetica", "fracciones", `Simplifica ${a}/${b}:`, options, correctIndex, `MCD = ${g} → ${ans}.`, 1, id("fracciones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, `${a * 3}/${b * 3}`, [`${a}/${b * 3}`, `${a + 3}/${b + 3}`, `${a * 3}/${b}`, "1"]);
    return q("aritmetica", "fracciones", `Una fracción equivalente a ${a}/${b} es:`, options, correctIndex, `Multiplica numerador y denominador por 3: ${a * 3}/${b * 3}.`, 1, id("fracciones", i, seed));
  }
  const c = randint(rng, 2, 5);
  const { options, correctIndex } = nOptions(rng, `${a * c}/${b}`, [`${a}/${b * c}`, `${a + c}/${b}`, `${a * c}/${b * c}`, `${c}/${b}`]);
  return q("aritmetica", "fracciones", `${c} × (${a}/${b}) =`, options, correctIndex, `${c}·${a}/${b} = ${a * c}/${b}.`, 2, id("fracciones", i, seed));
}

function razones(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 2, 9);
  const b = randint(rng, 2, 9);
  const k = randint(rng, 2, 6);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, `${a}/${b}`, [`${b}/${a}`, `${a * b}`, `${a + b}`, `${a - b}`]);
    return q("aritmetica", "razones-proporciones", `La razón ${a} : ${b} se escribe como:`, options, correctIndex, "a:b = a/b.", 1, id("razones-proporciones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, String(a * k), [String(b * k), String(a + k), String(a * b), String(k)]);
    return q("aritmetica", "razones-proporciones", `Si ${a}/${b} = x/${b * k}, entonces x =`, options, correctIndex, `Proporción: x = ${a}·${b * k}/${b} = ${a * k}.`, 2, id("razones-proporciones", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, String(a * b), [String(a + b), String(Math.abs(a - b)), String(a + b + 1), String((a + b) / 2)]);
  return q("aritmetica", "razones-proporciones", `Si a/x = x/b con a = ${a} y b = ${b}, entonces x² =`, options, correctIndex, "Media geométrica: x² = a·b = " + a * b + ".", 3, id("razones-proporciones", i, seed));
}

function regla(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const a = pick(rng, [3, 4, 5, 6]);
    const pa = a * pick(rng, [8, 10, 12]);
    const b = a + pick(rng, [2, 3, 4]);
    const pb = (pa / a) * b;
    const { options, correctIndex } = optionsAround(rng, pb);
    return q("aritmetica", "regla-de-tres", `Si ${a} cuadernos cuestan ${pa}, ${b} cuadernos cuestan:`, options, correctIndex, `Regla de tres directa: x = ${pa}·${b}/${a} = ${pb}.`, 1, id("regla-de-tres", i, seed));
  }
  if (kind === 1) {
    const men = 4;
    const days = 12;
    const men2 = 6;
    const days2 = (men * days) / men2;
    const { options, correctIndex } = optionsAround(rng, days2);
    return q("aritmetica", "regla-de-tres", `${men} obreros tardan ${days} días. ${men2} obreros tardarán:`, options, correctIndex, `Inversa: x = ${men}·${days}/${men2} = ${days2} días.`, 2, id("regla-de-tres", i, seed));
  }
  const v = 60;
  const t = 2;
  const v2 = 80;
  const t2 = (v * t) / v2;
  const { options, correctIndex } = nOptions(rng, "1.5 h", ["2 h", "3 h", "1 h", "2.5 h"]);
  return q("aritmetica", "regla-de-tres", `Un auto a ${v} km/h recorre un tramo en ${t} h. A ${v2} km/h tarda:`, options, correctIndex, `Inversa: t' = ${v}·${t}/${v2} = ${t2} h = 1.5 h.`, 2, id("regla-de-tres", i, seed));
}

function porcentajes(rng: Rng, i: number, seed: number): Question {
  const p = pick(rng, [10, 15, 20, 25, 40, 50]);
  const n = pick(rng, [80, 120, 200, 250, 400]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const val = (p * n) / 100;
    const { options, correctIndex } = optionsAround(rng, val);
    return q("aritmetica", "porcentajes", `Calcula el ${p}% de ${n}.`, options, correctIndex, `${p}×${n}/100 = ${val}.`, 1, id("porcentajes", i, seed));
  }
  if (kind === 1) {
    const val = n * (1 + p / 100);
    const { options, correctIndex } = optionsAround(rng, val);
    return q("aritmetica", "porcentajes", `${n} aumentado en ${p}% es:`, options, correctIndex, `${n}(1+${p}/100) = ${val}.`, 2, id("porcentajes", i, seed));
  }
  const val = (40 / 200) * 100;
  const { options, correctIndex } = optionsAround(rng, val);
  return q("aritmetica", "porcentajes", "40 es qué porcentaje de 200:", options, correctIndex, "40/200 × 100% = 20%.", 2, id("porcentajes", i, seed));
}

function promedios(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 8, 18);
  const b = randint(rng, 8, 18);
  const c = randint(rng, 8, 18);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const m = (a + b + c) / 3;
    const rounded = Math.round(m * 10) / 10;
    const { options, correctIndex } = nOptions(rng, String(rounded), [String(a + b + c), String(Math.round(m)), String(a), String((a + b) / 2)]);
    return q("aritmetica", "promedios", `El promedio de ${a}, ${b} y ${c} es:`, options, correctIndex, `(${a}+${b}+${c})/3 = ${rounded}.`, 1, id("promedios", i, seed));
  }
  if (kind === 1) {
    const m = 14;
    const x = 4 * m - (12 + 15 + 13);
    const { options, correctIndex } = optionsAround(rng, x);
    return q("aritmetica", "promedios", `El promedio de 12, 15, 13 y x es 14. Entonces x =`, options, correctIndex, `Suma = 14×4 = 56. x = 56 − 40 = 16.`, 2, id("promedios", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "16", ["14", "15", "18", "12"]);
  return q("aritmetica", "promedios", "Notas 10 y 20 con pesos 40% y 60%. El promedio ponderado es:", options, correctIndex, "0.4×10 + 0.6×20 = 4 + 12 = 16.", 2, id("promedios", i, seed));
}

function interes(rng: Rng, i: number, seed: number): Question {
  const C = pick(rng, [1000, 1500, 2000, 2500, 4000]);
  const r = pick(rng, [5, 10, 12, 20]);
  const t = pick(rng, [1, 2, 3, 4]);
  const I = (C * r * t) / 100;
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = optionsAround(rng, I);
    return q("aritmetica", "interes-simple", `Interés simple de C=${C}, r=${r}% anual, t=${t} años:`, options, correctIndex, `I = C·r·t/100 = ${C}·${r}·${t}/100 = ${I}.`, 2, id("interes-simple", i, seed));
  }
  if (kind === 1) {
    const M = C + I;
    const { options, correctIndex } = optionsAround(rng, M);
    return q("aritmetica", "interes-simple", `Monto de un capital ${C} al ${r}% durante ${t} años (interés simple):`, options, correctIndex, `M = C + I = ${C} + ${I} = ${M}.`, 2, id("interes-simple", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "I = C·r·t", ["I = C(1+r)^t", "I = C/r·t", "M = C·r", "I = C+r+t"]);
  return q("aritmetica", "interes-simple", "La fórmula del interés simple es:", options, correctIndex, "I = C · r · t, con r en forma decimal o porcentual coherente.", 1, id("interes-simple", i, seed));
}
