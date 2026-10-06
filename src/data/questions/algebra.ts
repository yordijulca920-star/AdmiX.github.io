import type { Question } from "@/lib/models/types";
import { makeRng, nOptions, optionsAround, pick, q, randint, type Rng } from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `algebra:${topic}:${seed}:${i}`;
}

export function generateAlgebra(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + 409);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(one(topicId, rng, i, seed));
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "teoria-exponentes":
      return exponentes(rng, i, seed);
    case "productos-notables":
      return productos(rng, i, seed);
    case "polinomios":
      return polinomios(rng, i, seed);
    case "grados":
      return grados(rng, i, seed);
    case "valor-numerico":
      return valor(rng, i, seed);
    case "factorizacion":
      return factorizacion(rng, i, seed);
    case "aspa-simple":
      return aspaSimple(rng, i, seed);
    case "aspa-doble":
      return aspaDoble(rng, i, seed);
    case "ruffini":
      return ruffini(rng, i, seed);
    case "ecuaciones":
      return ecuaciones(rng, i, seed);
    case "inecuaciones":
      return inecuaciones(rng, i, seed);
    case "funciones":
      return funciones(rng, i, seed);
    case "dominio-rango":
      return dominio(rng, i, seed);
    case "graficas":
      return graficas(rng, i, seed);
    default:
      return exponentes(rng, i, seed);
  }
}

function exponentes(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 2, 5);
  const m = randint(rng, 2, 5);
  const n = randint(rng, 2, 5);
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, `${a}${pow(m + n)}`, [`${a}${pow(m * n)}`, `${a * 2}${pow(m + n)}`, `${a}${pow(m - n)}`, String(a ** m * n)]);
    return q("algebra", "teoria-exponentes", `${a}${pow(m)} · ${a}${pow(n)} =`, options, correctIndex, "Misma base: se suman exponentes → " + a + "^" + (m + n) + ".", 1, id("teoria-exponentes", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, `${a}${pow(m * n)}`, [`${a}${pow(m + n)}`, `${a * n}${pow(m)}`, String(a ** m + n), `${a}${pow(m - n)}`]);
    return q("algebra", "teoria-exponentes", `(${a}${pow(m)})${pow(n)} =`, options, correctIndex, "Potencia de potencia: se multiplican exponentes.", 1, id("teoria-exponentes", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "1", ["0", String(a), `${a}${pow(m)}`, "-1"]);
    return q("algebra", "teoria-exponentes", `${a}${pow(0)} =`, options, correctIndex, "a⁰ = 1 si a ≠ 0.", 1, id("teoria-exponentes", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, `1/${a}${pow(m)}`, [`${a}${pow(m)}`, `-${a}${pow(m)}`, "0", `${a}${pow(-1)}`]);
  return q("algebra", "teoria-exponentes", `${a}${pow(-m)} =`, options, correctIndex, "Exponente negativo: 1/a^m.", 2, id("teoria-exponentes", i, seed));
}

function pow(n: number) {
  const map: Record<number, string> = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const s = String(n);
  return s
    .split("")
    .map((ch) => (ch === "-" ? "⁻" : map[Number(ch)] ?? ch))
    .join("");
}

function productos(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 2, 9);
  const b = randint(rng, 1, 8);
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, `x² + ${2 * a}x + ${a * a}`, [`x² + ${a}x + ${a}`, `x² − ${2 * a}x + ${a * a}`, `x² + ${a * a}`, `2x + ${a}`]);
    return q("algebra", "productos-notables", `(x + ${a})² =`, options, correctIndex, "(x+a)² = x² + 2ax + a².", 1, id("productos-notables", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, `x² − ${a * a}`, [`x² + ${a * a}`, `x² − ${2 * a}x + ${a * a}`, `(x − ${a})²`, `x − ${a}`]);
    return q("algebra", "productos-notables", `(x + ${a})(x − ${a}) =`, options, correctIndex, "Diferencia de cuadrados: x² − a².", 1, id("productos-notables", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, `x² + ${a + b}x + ${a * b}`, [`x² + ${a * b}x + ${a + b}`, `x² − ${a + b}x + ${a * b}`, `(x+${a})²`, `x + ${a + b}`]);
    return q("algebra", "productos-notables", `(x + ${a})(x + ${b}) =`, options, correctIndex, "x² + (a+b)x + ab.", 2, id("productos-notables", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, `x³ + ${3 * a}x² + ${3 * a * a}x + ${a ** 3}`, [`x³ + ${a ** 3}`, `x³ + ${a}x + ${a ** 3}`, `(x+${a})²`, `x³ − ${a ** 3}`]);
  return q("algebra", "productos-notables", `(x + ${a})³ =`, options, correctIndex, "(x+a)³ = x³ + 3a x² + 3a² x + a³.", 3, id("productos-notables", i, seed));
}

function polinomios(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "5x³ − x + 2", ["5x³ + 2 − x", "2 − x + 5x³", "−x + 2 + 5x³", "Ninguno está ordenado"]);
    return q("algebra", "polinomios", "El polinomio 2 − x + 5x³ ordenado en forma canónica (grados decrecientes) es:", options, correctIndex, "Se ordena: 5x³ − x + 2.", 1, id("polinomios", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "8x² + 2x", ["8x² − 2x", "6x² + 8x", "2x²", "8x³"]);
    return q("algebra", "polinomios", "(3x² + 5x) + (5x² − 3x) =", options, correctIndex, "3x²+5x² + 5x−3x = 8x² + 2x.", 1, id("polinomios", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "6x² − 15x", ["6x − 15", "x² − 5x", "6x² + 15x", "−6x²"]);
  return q("algebra", "polinomios", "3x(2x − 5) =", options, correctIndex, "6x² − 15x.", 1, id("polinomios", i, seed));
}

function grados(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "4", ["3", "7", "1", "0"]);
    return q("algebra", "grados", "El grado de 3x⁴ − 2x + 1 es:", options, correctIndex, "El mayor exponente de x es 4.", 1, id("grados", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "5", ["3", "2", "6", "1"]);
    return q("algebra", "grados", "Grado absoluto de 4x²y³ + xy es:", options, correctIndex, "2+3 = 5 en el primer término, mayor que 1+1.", 2, id("grados", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "0", ["1", "indefinido", "∞", "−1"]);
  return q("algebra", "grados", "El grado del polinomio constante 7 es:", options, correctIndex, "Una constante no nula tiene grado 0.", 2, id("grados", i, seed));
}

function valor(rng: Rng, i: number, seed: number): Question {
  const x = randint(rng, -3, 5);
  const a = randint(rng, 1, 4);
  const b = randint(rng, -4, 4);
  const c = randint(rng, -5, 5);
  const val = a * x * x + b * x + c;
  const { options, correctIndex } = optionsAround(rng, val);
  const bStr = b >= 0 ? `+ ${b}x` : `− ${Math.abs(b)}x`;
  const cStr = c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`;
  return q("algebra", "valor-numerico", `Valor numérico de ${a}x² ${bStr} ${cStr} en x = ${x}:`, options, correctIndex, `${a}(${x})² ${bStr.replace("x", `(${x})`)} ${cStr} = ${val}.`, 2, id("valor-numerico", i, seed));
}

function factorizacion(rng: Rng, i: number, seed: number): Question {
  const a = randint(rng, 2, 6);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, `${a}x(x + 2)`, [`${a}(x + 2)`, `x(x + ${a})`, `${a}x² + 2`, `(x+${a})(x+2)`]);
    return q("algebra", "factorizacion", `Factor común de ${a}x² + ${2 * a}x:`, options, correctIndex, `${a}x(x + 2).`, 1, id("factorizacion", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "(x − 3)(x + 3)", ["(x − 3)²", "(x + 3)²", "x² − 3", "(x − 9)(x + 1)"]);
    return q("algebra", "factorizacion", "x² − 9 =", options, correctIndex, "Diferencia de cuadrados: (x−3)(x+3).", 1, id("factorizacion", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "(x + 4)²", ["(x − 4)²", "(x + 2)(x + 8)", "x² + 4", "(x + 4)(x − 4)"]);
  return q("algebra", "factorizacion", "x² + 8x + 16 =", options, correctIndex, "Trinomio cuadrado perfecto: (x+4)².", 2, id("factorizacion", i, seed));
}

function aspaSimple(rng: Rng, i: number, seed: number): Question {
  const p = pick(rng, [2, 3, 4, 5, 6]);
  const r = pick(rng, [1, 2, 3, 4, 5]);
  if (p === r) {
    const { options, correctIndex } = nOptions(rng, `(x + ${p})²`, [`(x − ${p})²`, `x(x + ${2 * p})`, `(x + ${p})(x − ${p})`, `x² + ${p}`]);
    return q("algebra", "aspa-simple", `x² + ${2 * p}x + ${p * p} =`, options, correctIndex, `Aspa simple: ${p} y ${p}. (x+${p})².`, 2, id("aspa-simple", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, `(x + ${p})(x + ${r})`, [`(x − ${p})(x − ${r})`, `(x + ${p + r})(x + ${p * r})`, `x(x + ${p + r})`, `(x + ${p})(x − ${r})`]);
  return q("algebra", "aspa-simple", `x² + ${p + r}x + ${p * r} =`, options, correctIndex, `Números que suman ${p + r} y multiplican ${p * r}: ${p} y ${r}.`, 2, id("aspa-simple", i, seed));
}

function aspaDoble(rng: Rng, i: number, seed: number): Question {
  const { options, correctIndex } = nOptions(rng, "(2x + 3)(x + 1)", ["(2x + 1)(x + 3)", "(2x − 3)(x + 1)", "(x + 3)(x + 2)", "2x(x + 3)"]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    return q("algebra", "aspa-doble", "2x² + 5x + 3 =", options, correctIndex, "Aspa doble: (2x+3)(x+1) = 2x² + 2x + 3x + 3.", 3, id("aspa-doble", i, seed));
  }
  if (kind === 1) {
    const o = nOptions(rng, "(3x + 1)(x + 2)", ["(3x + 2)(x + 1)", "(3x − 1)(x + 2)", "3x(x + 2)", "(x+3)(x+1)"]);
    return q("algebra", "aspa-doble", "3x² + 7x + 2 =", o.options, o.correctIndex, "(3x+1)(x+2) = 3x² + 6x + x + 2.", 3, id("aspa-doble", i, seed));
  }
  const o = nOptions(rng, "(2x − 1)(x + 3)", ["(2x + 1)(x − 3)", "(2x − 3)(x + 1)", "(2x − 1)(x − 3)", "2x(x+3)"]);
  return q("algebra", "aspa-doble", "2x² + 5x − 3 =", o.options, o.correctIndex, "(2x−1)(x+3) = 2x² + 6x − x − 3 = 2x² + 5x − 3.", 3, id("aspa-doble", i, seed));
}

function ruffini(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "x² + 5x + 6", ["x² + x + 6", "x² − 5x + 6", "x + 6", "x² + 6"]);
    return q("algebra", "ruffini", "Al dividir x³ + 4x² + x − 6 por (x − 1) con Ruffini, el cociente es:", options, correctIndex, "Raíz 1: (x−1)(x²+5x+6)=x³+4x²+x−6. Cociente x²+5x+6.", 3, id("ruffini", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "−1", ["1", "2", "0", "3"]);
    return q("algebra", "ruffini", "Una raíz entera de x³ + x² − x − 1 = 0 es:", options, correctIndex, "P(−1) = −1 + 1 + 1 − 1 = 0. Raíz x = −1.", 2, id("ruffini", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "El resto es P(a)", ["El resto es P'(a)", "El cociente es a", "No se puede aplicar", "El resto es 0 siempre"]);
  return q("algebra", "ruffini", "Al dividir P(x) entre (x − a), el teoreado del resto dice:", options, correctIndex, "R = P(a). Ruffini calcula ese valor de forma sintética.", 2, id("ruffini", i, seed));
}

function ecuaciones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const a = randint(rng, 2, 8);
    const x = randint(rng, -5, 9);
    const b = randint(rng, 1, 10);
    const c = a * x + b;
    const { options, correctIndex } = optionsAround(rng, x);
    return q("algebra", "ecuaciones", `${a}x + ${b} = ${c}. x =`, options, correctIndex, `${a}x = ${c - b} → x = ${x}.`, 1, id("ecuaciones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "2 y 3", ["−2 y −3", "6 y 1", "5 y 0", "1 y 5"]);
    return q("algebra", "ecuaciones", "Las soluciones de x² − 5x + 6 = 0 son:", options, correctIndex, "(x−2)(x−3)=0 → x=2, x=3.", 2, id("ecuaciones", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "4", ["−4", "2", "16", "0"]);
    return q("algebra", "ecuaciones", "Si √x = 2, x =", options, correctIndex, "x = 4 (y x ≥ 0).", 1, id("ecuaciones", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "x = 1", ["x = −1", "x = 0", "x = 2", "sin solución"]);
  return q("algebra", "ecuaciones", "2(x − 3) = x − 5. x =", options, correctIndex, "2x − 6 = x − 5 → x = 1.", 2, id("ecuaciones", i, seed));
}

function inecuaciones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "x > 3", ["x < 3", "x ≥ 3", "x ≤ 3", "x = 3"]);
    return q("algebra", "inecuaciones", "2x − 4 > 2. La solución es:", options, correctIndex, "2x > 6 → x > 3.", 1, id("inecuaciones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "x < −2", ["x > −2", "x < 2", "x > 2", "x ≤ −2"]);
    return q("algebra", "inecuaciones", "−x > 2. Al multiplicar por −1 se invierte el sentido:", options, correctIndex, "x < −2.", 2, id("inecuaciones", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "[2, 5]", ["(2, 5)", "(2, 5]", "[2, 5)", "ℝ"]);
  return q("algebra", "inecuaciones", "2 ≤ x ≤ 5 en notación de intervalos es:", options, correctIndex, "Corchetes porque incluye extremos: [2, 5].", 2, id("inecuaciones", i, seed));
}

function funciones(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const x = randint(rng, -3, 6);
    const val = 2 * x + 1;
    const { options, correctIndex } = optionsAround(rng, val);
    return q("algebra", "funciones", `Si f(x) = 2x + 1, f(${x}) =`, options, correctIndex, `2(${x})+1 = ${val}.`, 1, id("funciones", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Un único y para cada x del dominio", ["Varios y para un x", "x = y siempre", "Solo rectas", "f(x) > 0"]);
    return q("algebra", "funciones", "Una función f: D → ℝ asigna:", options, correctIndex, "A cada x del dominio le corresponde exactamente un f(x).", 1, id("funciones", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "f(g(x))", ["f(x)g(x)", "f(x)+g(x)", "g(f(x)) siempre igual", "f/g"]);
  return q("algebra", "funciones", "La composición (f ∘ g)(x) es:", options, correctIndex, "Primero g, luego f: f(g(x)).", 2, id("funciones", i, seed));
}

function dominio(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "ℝ − {2}", ["ℝ", "ℝ − {0}", "[2, ∞)", "x > 2"]);
    return q("algebra", "dominio-rango", "Dominio de f(x) = 1/(x − 2):", options, correctIndex, "El denominador no puede ser 0 → x ≠ 2.", 2, id("dominio-rango", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "[0, ∞)", ["ℝ", "(0, ∞)", "ℝ − {0}", "(−∞, 0]"]);
    return q("algebra", "dominio-rango", "Dominio de f(x) = √x (en reales):", options, correctIndex, "El radicando debe ser ≥ 0.", 2, id("dominio-rango", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "[0, ∞)", ["ℝ", "(−∞, 0]", "ℝ − {0}", "[1, ∞)"]);
  return q("algebra", "dominio-rango", "Rango de f(x) = x² es:", options, correctIndex, "Un cuadrado real nunca es negativo: [0, ∞).", 2, id("dominio-rango", i, seed));
}

function graficas(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "Una recta de pendiente 2", ["Una parábola", "Una hipérbola", "Un círculo", "Una constante"]);
    return q("algebra", "graficas", "La gráfica de y = 2x − 1 es:", options, correctIndex, "Función lineal: recta con pendiente 2 y ordenada −1.", 1, id("graficas", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Parábola con vértice en el origen", ["Recta", "Círculo", "Exponencial", "Hipérbola"]);
    return q("algebra", "graficas", "y = x² es:", options, correctIndex, "Parábola vertical, vértice (0,0), abre hacia arriba.", 1, id("graficas", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Se desplaza 3 unidades hacia arriba", ["Hacia abajo 3", "A la derecha 3", "A la izquierda 3", "Se refleja"]);
    return q("algebra", "graficas", "y = f(x) + 3 respecto de y = f(x):", options, correctIndex, "Sumar k > 0 a f desplaza la gráfica hacia arriba.", 2, id("graficas", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "(0, −4)", ["(−4, 0)", "(0, 4)", "(4, 0)", "(2, −4)"]);
  return q("algebra", "graficas", "La ordenada al origen de y = 3x − 4 es:", options, correctIndex, "x = 0 → y = −4. Punto (0, −4).", 1, id("graficas", i, seed));
}
