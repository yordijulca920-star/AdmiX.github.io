import type { Question } from "@/lib/models/types";
import {
  choiceOptions,
  gcd,
  makeRng,
  nOptions,
  optionsAround,
  pick,
  q,
  randint,
  type Rng,
} from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `razonamiento:${topic}:${seed}:${i}`;
}

export function generateRazonamiento(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + topicId.length * 97);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    out.push(one(topicId, rng, i, seed));
  }
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "planteo-ecuaciones":
      return planteo(rng, i, seed);
    case "problemas-edades":
      return edades(rng, i, seed);
    case "sucesiones":
      return sucesiones(rng, i, seed);
    case "series":
      return series(rng, i, seed);
    case "arreglos-numericos":
      return arreglos(rng, i, seed);
    case "operadores":
      return operadores(rng, i, seed);
    case "analisis-combinatorio":
      return combinatorio(rng, i, seed);
    case "probabilidades":
      return probabilidad(rng, i, seed);
    case "fracciones":
      return fracciones(rng, i, seed);
    case "porcentajes":
      return porcentajes(rng, i, seed);
    default:
      return planteo(rng, i, seed);
  }
}

function planteo(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 4);
  if (kind === 0) {
    const x = randint(rng, 4, 18);
    const k = randint(rng, 2, 7);
    const b = randint(rng, 3, 20);
    const total = k * x + b;
    const { options, correctIndex } = optionsAround(rng, x);
    return q(
      "razonamiento",
      "planteo-ecuaciones",
      `El ${nombre(k)} de un número más ${b} es ${total}. ¿Cuál es el número?`,
      options,
      correctIndex,
      `${k}x + ${b} = ${total} → ${k}x = ${total - b} → x = ${x}.`,
      1,
      id("planteo-ecuaciones", i, seed),
    );
  }
  if (kind === 1) {
    const x = randint(rng, 6, 24);
    const total = 3 * x + 5;
    const { options, correctIndex } = optionsAround(rng, x);
    return q(
      "razonamiento",
      "planteo-ecuaciones",
      `Pensé un número, lo tripliqué y sumé 5. Obtuve ${total}. El número es:`,
      options,
      correctIndex,
      `3x + 5 = ${total} → 3x = ${total - 5} → x = ${x}.`,
      1,
      id("planteo-ecuaciones", i, seed),
    );
  }
  if (kind === 2) {
    const a = randint(rng, 8, 20);
    const b = randint(rng, 4, a - 2);
    const s = a + b;
    const d = a - b;
    const { options, correctIndex } = optionsAround(rng, a);
    return q(
      "razonamiento",
      "planteo-ecuaciones",
      `Dos números suman ${s} y su diferencia es ${d}. El mayor es:`,
      options,
      correctIndex,
      `x + y = ${s}, x − y = ${d}. Sumando: 2x = ${s + d} → x = ${a}.`,
      2,
      id("planteo-ecuaciones", i, seed),
    );
  }
  if (kind === 3) {
    const n = randint(rng, 2, 6) * 6;
    const { options, correctIndex } = optionsAround(rng, n);
    return q(
      "razonamiento",
      "planteo-ecuaciones",
      `La mitad de un número más su tercio es ${n / 2 + n / 3}. ¿Cuál es el número?`,
      options,
      correctIndex,
      `n/2 + n/3 = 5n/6. Entonces 5n/6 = ${n / 2 + n / 3} → n = ${n}.`,
      2,
      id("planteo-ecuaciones", i, seed),
    );
  }
  const x = randint(rng, 5, 15);
  const y = x + randint(rng, 2, 8);
  const { options, correctIndex } = optionsAround(rng, x + y);
  return q(
    "razonamiento",
    "planteo-ecuaciones",
    `Un padre tiene ${y} años y su hijo ${x}. ¿Cuánto suman sus edades actuales?`,
    options,
    correctIndex,
    `${x} + ${y} = ${x + y}.`,
    1,
    id("planteo-ecuaciones", i, seed),
  );
}

function nombre(k: number) {
  const map: Record<number, string> = {
    2: "doble",
    3: "triple",
    4: "cuádruple",
    5: "quíntuple",
  };
  return map[k] ?? `${k} veces`;
}

function edades(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const hijo = randint(rng, 8, 16);
    const padre = hijo * 3;
    const { options, correctIndex } = optionsAround(rng, padre);
    return q(
      "razonamiento",
      "problemas-edades",
      `Un padre tiene el triple de la edad de su hijo. Si el hijo tiene ${hijo} años, el padre tiene:`,
      options,
      correctIndex,
      `3 × ${hijo} = ${padre} años.`,
      1,
      id("problemas-edades", i, seed),
    );
  }
  if (kind === 1) {
    const h = randint(rng, 10, 18);
    const p = h + 24;
    const years = 6;
    const { options, correctIndex } = optionsAround(rng, p + years - (h + years));
    return q(
      "razonamiento",
      "problemas-edades",
      `Hoy un padre tiene ${p} años y su hijo ${h}. Dentro de ${years} años, la diferencia de edades será:`,
      options,
      correctIndex,
      `La diferencia de edades es constante: ${p} − ${h} = ${p - h} años.`,
      1,
      id("problemas-edades", i, seed),
    );
  }
  if (kind === 2) {
    const a = randint(rng, 12, 20);
    const b = a - 4;
    const { options, correctIndex } = optionsAround(rng, a + b);
    return q(
      "razonamiento",
      "problemas-edades",
      `Ana tiene ${a} años y Luis tiene 4 menos. La suma de sus edades es:`,
      options,
      correctIndex,
      `${a} + ${b} = ${a + b}.`,
      1,
      id("problemas-edades", i, seed),
    );
  }
  const hijo = randint(rng, 6, 12);
  const padre = 30 + randint(rng, 0, 10);
  const t = padre - 2 * hijo;
  if (t <= 0) {
    const { options, correctIndex } = optionsAround(rng, padre - hijo);
    return q(
      "razonamiento",
      "problemas-edades",
      `Hoy el padre tiene ${padre} años y el hijo ${hijo}. La diferencia de edades es:`,
      options,
      correctIndex,
      `${padre} − ${hijo} = ${padre - hijo} años, y no cambia con el tiempo.`,
      1,
      id("problemas-edades", i, seed),
    );
  }
  const opts = optionsAround(rng, t);
  return q(
    "razonamiento",
    "problemas-edades",
    `Hoy el padre tiene ${padre} años y el hijo ${hijo}. ¿Dentro de cuántos años la edad del padre será el doble de la del hijo?`,
    opts.options,
    opts.correctIndex,
    `p + t = 2(h + t) → ${padre} + t = 2(${hijo} + t) → t = ${t}.`,
    2,
    id("problemas-edades", i, seed),
  );
}

function sucesiones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 4);
  if (kind === 0) {
    const a = randint(rng, 2, 9);
    const d = randint(rng, 2, 7);
    const seq = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d];
    const next = a + 5 * d;
    const { options, correctIndex } = optionsAround(rng, next);
    return q(
      "razonamiento",
      "sucesiones",
      `En la sucesión aritmética ${seq.join(", ")}, … el siguiente término es:`,
      options,
      correctIndex,
      `La razón es ${d}. ${seq[4]} + ${d} = ${next}.`,
      1,
      id("sucesiones", i, seed),
    );
  }
  if (kind === 1) {
    const a = randint(rng, 2, 5);
    const r = 2;
    const seq = [a, a * r, a * r * r, a * r ** 3];
    const next = a * r ** 4;
    const { options, correctIndex } = optionsAround(rng, next);
    return q(
      "razonamiento",
      "sucesiones",
      `En la sucesión geométrica ${seq.join(", ")}, … el siguiente término es:`,
      options,
      correctIndex,
      `La razón es ${r}. ${seq[3]} × ${r} = ${next}.`,
      2,
      id("sucesiones", i, seed),
    );
  }
  if (kind === 2) {
    const n = 6;
    const seq = [2, 5, 10, 17, 26];
    const next = n * n + 1;
    const { options, correctIndex } = optionsAround(rng, next);
    return q(
      "razonamiento",
      "sucesiones",
      `En 2, 5, 10, 17, 26, … el siguiente término es:`,
      options,
      correctIndex,
      `Patrón n² + 1: 1+1, 4+1, 9+1, 16+1, 25+1, 36+1 = 37.`,
      2,
      id("sucesiones", i, seed),
    );
  }
  if (kind === 3) {
    const seq = [1, 1, 2, 3, 5, 8, 13];
    const next = 21;
    const { options, correctIndex } = optionsAround(rng, next);
    return q(
      "razonamiento",
      "sucesiones",
      `En la sucesión de Fibonacci 1, 1, 2, 3, 5, 8, 13, … el siguiente término es:`,
      options,
      correctIndex,
      `Cada término es la suma de los dos anteriores: 8 + 13 = 21.`,
      2,
      id("sucesiones", i, seed),
    );
  }
  const a = randint(rng, 3, 8);
  const seq = [a, a + 1, a + 3, a + 6, a + 10];
  const next = a + 15;
  const { options, correctIndex } = optionsAround(rng, next);
  return q(
    "razonamiento",
    "sucesiones",
    `En ${seq.join(", ")}, … el siguiente término es:`,
    options,
    correctIndex,
    `Se suman 1, 2, 3, 4, 5… → ${seq[4]} + 5 = ${next}.`,
    2,
    id("sucesiones", i, seed),
  );
}

function series(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const n = randint(rng, 8, 20);
    const sum = (n * (n + 1)) / 2;
    const { options, correctIndex } = optionsAround(rng, sum);
    return q(
      "razonamiento",
      "series",
      `La suma 1 + 2 + 3 + … + ${n} es:`,
      options,
      correctIndex,
      `S = n(n+1)/2 = ${n}×${n + 1}/2 = ${sum}.`,
      2,
      id("series", i, seed),
    );
  }
  if (kind === 1) {
    const n = randint(rng, 5, 12);
    const sum = n * n;
    const { options, correctIndex } = optionsAround(rng, sum);
    return q(
      "razonamiento",
      "series",
      `La suma de los ${n} primeros impares 1 + 3 + … es:`,
      options,
      correctIndex,
      `La suma de los n primeros impares es n² = ${n}² = ${sum}.`,
      2,
      id("series", i, seed),
    );
  }
  const a = randint(rng, 2, 5);
  const n = randint(rng, 4, 8);
  const d = randint(rng, 2, 5);
  const last = a + (n - 1) * d;
  const sum = (n * (a + last)) / 2;
  const { options, correctIndex } = optionsAround(rng, sum);
  return q(
    "razonamiento",
    "series",
    `Suma de ${n} términos de una PA con a₁ = ${a} y razón ${d}:`,
    options,
    correctIndex,
    `aₙ = ${a} + ${n - 1}×${d} = ${last}. S = n(a₁+aₙ)/2 = ${n}(${a}+${last})/2 = ${sum}.`,
    3,
    id("series", i, seed),
  );
}

function arreglos(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const n = randint(rng, 3, 6);
    const magic = (n * (n * n + 1)) / 2;
    const { options, correctIndex } = optionsAround(rng, magic);
    return q(
      "razonamiento",
      "arreglos-numericos",
      `En un cuadrado mágico de ${n}×${n} con números 1 a ${n * n}, la constante mágica es:`,
      options,
      correctIndex,
      `K = n(n²+1)/2 = ${n}(${n * n}+1)/2 = ${magic}.`,
      3,
      id("arreglos-numericos", i, seed),
    );
  }
  if (kind === 1) {
    const a = randint(rng, 2, 9);
    const b = randint(rng, 2, 9);
    const c = randint(rng, 2, 9);
    const d = a + b + c;
    const { options, correctIndex } = optionsAround(rng, d);
    return q(
      "razonamiento",
      "arreglos-numericos",
      `En el arreglo, cada fila suma lo mismo. Si una fila es ${a} + ${b} + ${c}, la suma de cada fila es:`,
      options,
      correctIndex,
      `${a} + ${b} + ${c} = ${d}.`,
      1,
      id("arreglos-numericos", i, seed),
    );
  }
  const n = randint(rng, 4, 9);
  const { options, correctIndex } = optionsAround(rng, n * n);
  return q(
    "razonamiento",
    "arreglos-numericos",
    `¿Cuántos números hay en una cuadrícula de ${n} por ${n}?`,
    options,
    correctIndex,
    `${n} × ${n} = ${n * n}.`,
    1,
    id("arreglos-numericos", i, seed),
  );
}

function operadores(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 3, 12);
  const b = randint(rng, 2, 9);
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const val = a + b + a * b;
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "operadores",
      `Se define a ★ b = a + b + a·b. Entonces ${a} ★ ${b} es:`,
      options,
      correctIndex,
      `${a} + ${b} + ${a}·${b} = ${a + b} + ${a * b} = ${val}.`,
      2,
      id("operadores", i, seed),
    );
  }
  if (kind === 1) {
    const val = 2 * a + b;
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "operadores",
      `Se define a Δ b = 2a + b. Entonces ${a} Δ ${b} es:`,
      options,
      correctIndex,
      `2×${a} + ${b} = ${val}.`,
      1,
      id("operadores", i, seed),
    );
  }
  if (kind === 2) {
    const val = a * a - b;
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "operadores",
      `Se define a ⊕ b = a² − b. Entonces ${a} ⊕ ${b} es:`,
      options,
      correctIndex,
      `${a}² − ${b} = ${a * a} − ${b} = ${val}.`,
      2,
      id("operadores", i, seed),
    );
  }
  const val = (a + b) * (a - b);
  const { options, correctIndex } = optionsAround(rng, val);
  return q(
    "razonamiento",
    "operadores",
    `Se define a ⊗ b = (a+b)(a−b). Entonces ${a} ⊗ ${b} es:`,
    options,
    correctIndex,
    `(${a}+${b})(${a}−${b}) = ${a + b}×${a - b} = ${val}.`,
    2,
    id("operadores", i, seed),
  );
}

function combinatorio(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const n = randint(rng, 4, 7);
    const fact = factorial(n);
    const { options, correctIndex } = optionsAround(rng, fact);
    return q(
      "razonamiento",
      "analisis-combinatorio",
      `¿De cuántas formas se pueden ordenar ${n} libros distintos en una fila?`,
      options,
      correctIndex,
      `Permutaciones: ${n}! = ${fact}.`,
      2,
      id("analisis-combinatorio", i, seed),
    );
  }
  if (kind === 1) {
    const n = randint(rng, 5, 8);
    const k = 2;
    const val = (n * (n - 1)) / 2;
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "analisis-combinatorio",
      `¿Cuántos equipos de ${k} personas se pueden formar con ${n} candidatos?`,
      options,
      correctIndex,
      `C(${n},${k}) = ${n}! / (${k}! (${n}-${k})!) = ${val}.`,
      2,
      id("analisis-combinatorio", i, seed),
    );
  }
  if (kind === 2) {
    const n = randint(rng, 4, 6);
    const k = 2;
    const val = n * (n - 1);
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "analisis-combinatorio",
      `¿Cuántos números de ${k} cifras distintas se forman con {1,…,${n}}?`,
      options,
      correctIndex,
      `Variaciones: ${n}×${n - 1} = ${val}.`,
      2,
      id("analisis-combinatorio", i, seed),
    );
  }
  const n = 5;
  const val = 10;
  const { options, correctIndex } = nOptions(rng, "10", ["5", "20", "15", "8"]);
  return q(
    "razonamiento",
    "analisis-combinatorio",
    `C(5,3) es igual a:`,
    options,
    correctIndex,
    `C(5,3) = 10. Además C(n,k) = C(n,n−k) = C(5,2) = 10.`,
    2,
    id("analisis-combinatorio", i, seed),
  );
}

function factorial(n: number) {
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

function probabilidad(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const faces = 6;
    const fav = randint(rng, 1, 3);
    const { options, correctIndex } = nOptions(rng, `${fav}/6`, ["1/2", "1/3", "1/6", "2/3", `${fav}/5`]);
    return q(
      "razonamiento",
      "probabilidades",
      `Al lanzar un dado justo, la probabilidad de obtener un número ≤ ${fav} es:`,
      options,
      correctIndex,
      `Casos favorables ${fav} de ${faces}: ${fav}/6.`,
      1,
      id("probabilidades", i, seed),
    );
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "1/2", ["1/3", "1/4", "2/3", "1"]);
    return q(
      "razonamiento",
      "probabilidades",
      `Al lanzar una moneda justa, P(cara) es:`,
      options,
      correctIndex,
      `Dos resultados equiprobables → 1/2.`,
      1,
      id("probabilidades", i, seed),
    );
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "1/13", ["1/4", "1/52", "4/13", "1/12"]);
    return q(
      "razonamiento",
      "probabilidades",
      `De una baraja de 52 cartas, P(sacar un as) es:`,
      options,
      correctIndex,
      `Hay 4 ases: 4/52 = 1/13.`,
      2,
      id("probabilidades", i, seed),
    );
  }
  const r = randint(rng, 2, 5);
  const b = randint(rng, 2, 5);
  const t = r + b;
  const g = gcd(r, t);
  const { options, correctIndex } = nOptions(rng, `${r / g}/${t / g}`, [`${r}/${t + 1}`, `${b}/${t}`, "1/2", `${r}/${b}`]);
  return q(
    "razonamiento",
    "probabilidades",
    `Una urna tiene ${r} bolas rojas y ${b} azules. P(roja) es:`,
    options,
    correctIndex,
    `${r}/${t} = ${r / g}/${t / g}.`,
    2,
    id("probabilidades", i, seed),
  );
}

function fracciones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const a = randint(rng, 1, 5);
    const b = randint(rng, a + 1, 8);
    const c = randint(rng, 1, 5);
    const d = randint(rng, c + 1, 8);
    const num = a * d + c * b;
    const den = b * d;
    const g = gcd(num, den);
    const ans = `${num / g}/${den / g}`;
    const { options, correctIndex } = nOptions(rng, ans, [`${a + c}/${b + d}`, `${num}/${den + 1}`, `${a + c}/${den}`, `${num / g}/${den}`]);
    return q(
      "razonamiento",
      "fracciones",
      `${a}/${b} + ${c}/${d} =`,
      options,
      correctIndex,
      `${a}/${b} + ${c}/${d} = ${num}/${den} = ${ans}.`,
      2,
      id("fracciones", i, seed),
    );
  }
  if (kind === 1) {
    const a = randint(rng, 2, 9);
    const b = randint(rng, 2, 9);
    const { options, correctIndex } = nOptions(rng, `${a * b}`, [`${a + b}`, `${a * b + 1}`, `${a}`, `${b}`]);
    return q(
      "razonamiento",
      "fracciones",
      `${a} × ${b} =`,
      options,
      correctIndex,
      `${a} × ${b} = ${a * b}.`,
      1,
      id("fracciones", i, seed),
    );
  }
  if (kind === 2) {
    const a = 2;
    const b = 3;
    const { options, correctIndex } = nOptions(rng, "1/6", ["5/6", "1/3", "1/2", "2/5"]);
    return q(
      "razonamiento",
      "fracciones",
      `1 − 5/6 =`,
      options,
      correctIndex,
      `1 − 5/6 = 1/6.`,
      1,
      id("fracciones", i, seed),
    );
  }
  const n = randint(rng, 2, 8);
  const { options, correctIndex } = nOptions(rng, "1", [`${n}`, "0", `${n}/${n + 1}`, "2"]);
  return q(
    "razonamiento",
    "fracciones",
    `${n}/${n} es igual a:`,
    options,
    correctIndex,
    `Toda fracción a/a (a ≠ 0) vale 1.`,
    1,
    id("fracciones", i, seed),
  );
}

function porcentajes(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const p = pick(rng, [10, 15, 20, 25, 30, 40, 50]);
    const n = pick(rng, [80, 120, 200, 240, 300, 400]);
    const val = (p * n) / 100;
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "porcentajes",
      `El ${p}% de ${n} es:`,
      options,
      correctIndex,
      `${p}/100 × ${n} = ${val}.`,
      1,
      id("porcentajes", i, seed),
    );
  }
  if (kind === 1) {
    const n = pick(rng, [80, 100, 120, 150, 200]);
    const p = pick(rng, [10, 20, 25]);
    const val = n * (1 + p / 100);
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "porcentajes",
      `Un precio de ${n} aumenta ${p}%. El nuevo precio es:`,
      options,
      correctIndex,
      `${n} × (1 + ${p}/100) = ${val}.`,
      2,
      id("porcentajes", i, seed),
    );
  }
  if (kind === 2) {
    const n = pick(rng, [80, 100, 200, 250]);
    const p = pick(rng, [10, 20, 25]);
    const val = n * (1 - p / 100);
    const { options, correctIndex } = optionsAround(rng, val);
    return q(
      "razonamiento",
      "porcentajes",
      `Un artículo de ${n} tiene ${p}% de descuento. Precio final:`,
      options,
      correctIndex,
      `${n} × (1 − ${p}/100) = ${val}.`,
      2,
      id("porcentajes", i, seed),
    );
  }
  const part = pick(rng, [20, 30, 40, 45, 50]);
  const p = pick(rng, [10, 20, 25, 50]);
  const n = (part * 100) / p;
  const { options, correctIndex } = optionsAround(rng, n);
  return q(
    "razonamiento",
    "porcentajes",
    `Si el ${p}% de un número es ${part}, el número es:`,
    options,
    correctIndex,
    `n = ${part} × 100 / ${p} = ${n}.`,
    2,
    id("porcentajes", i, seed),
  );
}

void pick;
void choiceOptions;
