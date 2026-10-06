import type { Question } from "@/lib/models/types";
import { makeRng, nOptions, optionsAround, pick, q, randint, type Rng } from "./helpers";

function id(topic: string, i: number, seed: number) {
  return `fisica:${topic}:${seed}:${i}`;
}

export function generateFisica(topicId: string, count: number, seed: number): Question[] {
  const rng = makeRng(seed + 701);
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(one(topicId, rng, i, seed));
  return out;
}

function one(topicId: string, rng: Rng, i: number, seed: number): Question {
  switch (topicId) {
    case "cinematica":
      return cinematica(rng, i, seed);
    case "mruv":
      return mruv(rng, i, seed);
    case "caida-libre":
      return caida(rng, i, seed);
    case "estatica":
      return estatica(rng, i, seed);
    case "dcl":
      return dcl(rng, i, seed);
    case "dinamica":
      return dinamica(rng, i, seed);
    case "rozamiento":
      return rozamiento(rng, i, seed);
    case "trabajo":
      return trabajo(rng, i, seed);
    case "potencia":
      return potencia(rng, i, seed);
    case "energia-mecanica":
      return energia(rng, i, seed);
    case "conservacion-energia":
      return conservacion(rng, i, seed);
    case "electrodinamica":
      return electro(rng, i, seed);
    case "circuitos":
      return circuitos(rng, i, seed);
    default:
      return cinematica(rng, i, seed);
  }
}

function cinematica(rng: Rng, i: number, seed: number): Question {
  const d = pick(rng, [60, 80, 100, 120, 150]);
  const t = pick(rng, [2, 4, 5, 8, 10]);
  const v = d / t;
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = optionsAround(rng, v);
    return q("fisica", "cinematica", `Un móvil recorre ${d} m en ${t} s con MRU. Su rapidez es:`, options, correctIndex, `v = d/t = ${d}/${t} = ${v} m/s.`, 1, id("cinematica", i, seed),);
  }
  if (kind === 1) {
    const { options, correctIndex } = optionsAround(rng, v * t);
    return q("fisica", "cinematica", `Con v = ${v} m/s constantes, en ${t} s recorre:`, options, correctIndex, `d = v·t = ${v}·${t} = ${v * t} m.`, 1, id("cinematica", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "v = Δx / Δt", ["v = a·t", "x = v²", "v = x·t", "a = v/x"]);
  return q("fisica", "cinematica", "La velocidad media se define como:", options, correctIndex, "vₘ = desplazamiento / tiempo = Δx/Δt.", 1, id("cinematica", i, seed));
}

function mruv(rng: Rng, i: number, seed: number): Question {
  const v0 = pick(rng, [0, 2, 4, 5, 10]);
  const a = pick(rng, [2, 3, 4, 5]);
  const t = pick(rng, [2, 3, 4, 5]);
  const v = v0 + a * t;
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = optionsAround(rng, v);
    return q("fisica", "mruv", `MRUV: v₀ = ${v0} m/s, a = ${a} m/s², t = ${t} s. La velocidad final es:`, options, correctIndex, `v = v₀ + a t = ${v0} + ${a}·${t} = ${v} m/s.`, 2, id("mruv", i, seed));
  }
  if (kind === 1) {
    const x = v0 * t + 0.5 * a * t * t;
    const { options, correctIndex } = optionsAround(rng, x);
    return q("fisica", "mruv", `MRUV desde v₀=${v0} m/s, a=${a} m/s², t=${t} s. El desplazamiento es:`, options, correctIndex, `x = v₀t + ½at² = ${v0}·${t} + ½·${a}·${t}² = ${x} m.`, 2, id("mruv", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "v = v₀ + a t", ["v² = v₀ t", "x = a/t", "v = x/a", "a = v t"]);
  return q("fisica", "mruv", "La ecuación de velocidad en MRUV es:", options, correctIndex, "v = v₀ + a t.", 1, id("mruv", i, seed));
}

function caida(rng: Rng, i: number, seed: number): Question {
  const g = 10;
  const t = pick(rng, [1, 2, 3, 4]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const h = 0.5 * g * t * t;
    const { options, correctIndex } = optionsAround(rng, h);
    return q("fisica", "caida-libre", `Desde el reposo, en t = ${t} s de caída libre (g=10 m/s²) recorre:`, options, correctIndex, `h = ½gt² = 5·${t}² = ${h} m.`, 2, id("caida-libre", i, seed));
  }
  if (kind === 1) {
    const v = g * t;
    const { options, correctIndex } = optionsAround(rng, v);
    return q("fisica", "caida-libre", `Velocidad tras ${t} s de caída libre desde reposo (g=10):`, options, correctIndex, `v = gt = 10·${t} = ${v} m/s.`, 1, id("caida-libre", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "10 m/s²", ["9.8 km/s²", "10 m/s", "0", "5 m/s²"]);
  return q("fisica", "caida-libre", "En los exámenes de admisión suele tomarse g =", options, correctIndex, "Se usa g = 10 m/s² para simplificar cálculos.", 1, id("caida-libre", i, seed));
}

function estatica(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const f1 = pick(rng, [10, 15, 20, 30]);
    const { options, correctIndex } = optionsAround(rng, f1);
    return q("fisica", "estatica", `Dos fuerzas opuestas sobre un cuerpo en equilibrio. Si una vale ${f1} N, la otra vale:`, options, correctIndex, `ΣF = 0 → la otra es ${f1} N en sentido contrario.`, 1, id("estatica", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "ΣF = 0 y ΣM = 0", ["ΣF ≠ 0", "Solo ΣM = 0", "a > 0", "P = 0"]);
    return q("fisica", "estatica", "Condiciones de equilibrio de un cuerpo rígido:", options, correctIndex, "Fuerza neta nula y momento neto nulo.", 2, id("estatica", i, seed));
  }
  const w = pick(rng, [20, 40, 50, 80]);
  const { options, correctIndex } = optionsAround(rng, w);
  return q("fisica", "estatica", `Un bloque de peso ${w} N cuelga en reposo de una cuerda. La tensión es:`, options, correctIndex, "En reposo T = P = " + w + " N.", 1, id("estatica", i, seed));
}

function dcl(rng: Rng, i: number, seed: number): Question {
  const kind = randint(rng, 0, 3);
  if (kind === 0) {
    const { options, correctIndex } = nOptions(rng, "Peso, normal y rozamiento", ["Solo peso", "Solo tensión", "Magnetismo", "Solo normal"]);
    return q("fisica", "dcl", "Un bloque sobre una mesa rugosa, empujado horizontalmente, tiene en el DCL:", options, correctIndex, "Peso (abajo), normal (arriba), rozamiento (opuesto al deslizamiento) y la fuerza aplicada.", 2, id("dcl", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Hacia el centro de la Tierra", ["Perpendicular a la superficie", "Hacia adelante", "Nula", "Hacia arriba"]);
    return q("fisica", "dcl", "El peso de un cuerpo siempre se dibuja:", options, correctIndex, "El peso es mg, vertical hacia el centro de la Tierra.", 1, id("dcl", i, seed));
  }
  if (kind === 2) {
    const { options, correctIndex } = nOptions(rng, "Perpendicular a la superficie y hacia afuera", ["Paralela al piso", "Hacia el centro", "Siempre vertical", "Nula en planos"]);
    return q("fisica", "dcl", "La fuerza normal se dibuja:", options, correctIndex, "N es perpendicular a la superficie de contacto, hacia el cuerpo.", 2, id("dcl", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Opuesta al movimiento relativo", ["A favor del movimiento", "Siempre hacia abajo", "Perpendicular a N", "Nula si hay peso"]);
  return q("fisica", "dcl", "El rozamiento cinético se dibuja:", options, correctIndex, "Siempre opuesto a la velocidad relativa de las superficies.", 2, id("dcl", i, seed));
}

function dinamica(rng: Rng, i: number, seed: number): Question {
  const m = pick(rng, [2, 4, 5, 8, 10]);
  const a = pick(rng, [2, 3, 4, 5]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const F = m * a;
    const { options, correctIndex } = optionsAround(rng, F);
    return q("fisica", "dinamica", `F = m a. Si m = ${m} kg y a = ${a} m/s², F neta es:`, options, correctIndex, `F = ${m}·${a} = ${F} N.`, 1, id("dinamica", i, seed));
  }
  if (kind === 1) {
    const F = m * a;
    const { options, correctIndex } = optionsAround(rng, a);
    return q("fisica", "dinamica", `Un cuerpo de ${m} kg recibe ${F} N netos. Su aceleración es:`, options, correctIndex, `a = F/m = ${F}/${m} = ${a} m/s².`, 1, id("dinamica", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "F = m a", ["F = m/v", "F = m g h", "F = m/a", "P = F v"]);
  return q("fisica", "dinamica", "La segunda ley de Newton se escribe:", options, correctIndex, "ΣF = m a.", 1, id("dinamica", i, seed));
}

function rozamiento(rng: Rng, i: number, seed: number): Question {
  const mu = pick(rng, [0.2, 0.3, 0.4, 0.5]);
  const N = pick(rng, [20, 40, 50, 80, 100]);
  const fr = mu * N;
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = optionsAround(rng, fr);
    return q("fisica", "rozamiento", `μ = ${mu} y N = ${N} N. El rozamiento cinético vale:`, options, correctIndex, `fr = μ N = ${mu}·${N} = ${fr} N.`, 2, id("rozamiento", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "fr = μ N", ["fr = μ / N", "fr = m a", "fr = μ + N", "fr = N/μ"]);
    return q("fisica", "rozamiento", "La magnitud del rozamiento cinético es:", options, correctIndex, "fr = μₖ N.", 1, id("rozamiento", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Mayor o igual que el cinético", ["Siempre menor", "Siempre nulo", "Infinito", "Igual al peso"]);
  return q("fisica", "rozamiento", "El rozamiento estático máximo es, respecto al cinético:", options, correctIndex, "Suele cumplirse μₑ ≥ μₖ, por eso cuesta más arrancar que mantener el movimiento.", 2, id("rozamiento", i, seed));
}

function trabajo(rng: Rng, i: number, seed: number): Question {
  const F = pick(rng, [10, 20, 25, 40]);
  const d = pick(rng, [2, 4, 5, 8, 10]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const W = F * d;
    const { options, correctIndex } = optionsAround(rng, W);
    return q("fisica", "trabajo", `Una fuerza constante de ${F} N desplaza ${d} m en su misma dirección. W =`, options, correctIndex, `W = F d cos0° = ${F}·${d} = ${W} J.`, 1, id("trabajo", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "0 J", ["10 J", "F·d", "infinito", "mgh"]);
    return q("fisica", "trabajo", "El trabajo de una fuerza perpendicular al desplazamiento es:", options, correctIndex, "cos90° = 0 → W = 0.", 2, id("trabajo", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Joule (J)", ["Watt", "Newton", "Pascal", "Voltio"]);
  return q("fisica", "trabajo", "La unidad del trabajo en el SI es:", options, correctIndex, "1 J = 1 N·m.", 1, id("trabajo", i, seed));
}

function potencia(rng: Rng, i: number, seed: number): Question {
  const W = pick(rng, [100, 200, 400, 600]);
  const t = pick(rng, [2, 4, 5, 10]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const P = W / t;
    const { options, correctIndex } = optionsAround(rng, P);
    return q("fisica", "potencia", `Se realiza un trabajo de ${W} J en ${t} s. La potencia media es:`, options, correctIndex, `P = W/t = ${W}/${t} = ${P} W.`, 1, id("potencia", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Watt (W)", ["Joule", "Newton", "Ohm", "Ampere"]);
    return q("fisica", "potencia", "La unidad SI de potencia es:", options, correctIndex, "1 W = 1 J/s.", 1, id("potencia", i, seed));
  }
  const F = 20;
  const v = 3;
  const { options, correctIndex } = optionsAround(rng, F * v);
  return q("fisica", "potencia", `P = F v. Si F = ${F} N y v = ${v} m/s (paralelos):`, options, correctIndex, `P = ${F}·${v} = ${F * v} W.`, 2, id("potencia", i, seed));
}

function energia(rng: Rng, i: number, seed: number): Question {
  const m = pick(rng, [2, 4, 5, 10]);
  const v = pick(rng, [2, 4, 6, 8, 10]);
  const h = pick(rng, [2, 4, 5, 10]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const k = 0.5 * m * v * v;
    const { options, correctIndex } = optionsAround(rng, k);
    return q("fisica", "energia-mecanica", `Energía cinética de m=${m} kg, v=${v} m/s:`, options, correctIndex, `Ec = ½mv² = ½·${m}·${v}² = ${k} J.`, 2, id("energia-mecanica", i, seed));
  }
  if (kind === 1) {
    const u = m * 10 * h;
    const { options, correctIndex } = optionsAround(rng, u);
    return q("fisica", "energia-mecanica", `Ep gravitatoria de m=${m} kg a h=${h} m (g=10):`, options, correctIndex, `Ep = mgh = ${m}·10·${h} = ${u} J.`, 1, id("energia-mecanica", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Ec + Ep", ["Solo Ec", "F·t", "m a", "P/t"]);
  return q("fisica", "energia-mecanica", "La energía mecánica se define como:", options, correctIndex, "Em = Ec + Ep (y otras formas potenciales si aplica).", 1, id("energia-mecanica", i, seed));
}

function conservacion(rng: Rng, i: number, seed: number): Question {
  const m = 2;
  const h = pick(rng, [5, 8, 10, 20]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const v = Math.sqrt(2 * 10 * h);
    const { options, correctIndex } = optionsAround(rng, v);
    return q("fisica", "conservacion-energia", `Cae desde ${h} m (v₀=0, g=10, sin rozamiento). Rapidez al suelo:`, options, correctIndex, `mgh = ½mv² → v = √(2gh) = √(${2 * 10 * h}) = ${v} m/s.`, 3, id("conservacion-energia", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "Se conserva si solo hay fuerzas conservativas", ["Siempre disminuye", "Nunca se conserva", "Solo en el vacío interestelar", "Solo si hay rozamiento"]);
    return q("fisica", "conservacion-energia", "La energía mecánica:", options, correctIndex, "Se conserva cuando el trabajo de no conservativas es nulo.", 2, id("conservacion-energia", i, seed));
  }
  const u = m * 10 * h;
  const { options, correctIndex } = optionsAround(rng, u);
  return q("fisica", "conservacion-energia", `Un cuerpo de ${m} kg se suelta desde ${h} m. Ec al suelo (sin pérdidas) es:`, options, correctIndex, `Ec = Ep inicial = ${u} J.`, 2, id("conservacion-energia", i, seed));
}

function electro(rng: Rng, i: number, seed: number): Question {
  const V = pick(rng, [6, 12, 24]);
  const R = pick(rng, [2, 3, 4, 6, 12]);
  const I = V / R;
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const { options, correctIndex } = optionsAround(rng, I);
    return q("fisica", "electrodinamica", `Ley de Ohm: V=${V} V, R=${R} Ω. La corriente es:`, options, correctIndex, `I = V/R = ${V}/${R} = ${I} A.`, 1, id("electrodinamica", i, seed));
  }
  if (kind === 1) {
    const { options, correctIndex } = nOptions(rng, "V = I R", ["P = I/V", "V = I/R", "R = I V", "I = V R"]);
    return q("fisica", "electrodinamica", "La ley de Ohm se escribe:", options, correctIndex, "V = I R.", 1, id("electrodinamica", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "Ampere (A)", ["Voltio", "Ohm", "Watt", "Coulomb"]);
  return q("fisica", "electrodinamica", "La unidad de corriente eléctrica es:", options, correctIndex, "El ampere. 1 A = 1 C/s.", 1, id("electrodinamica", i, seed));
}

function circuitos(rng: Rng, i: number, seed: number): Question {
  const r1 = pick(rng, [2, 3, 4, 6]);
  const r2 = pick(rng, [2, 3, 4, 6, 12]);
  const kind = randint(rng, 0, 2);
  if (kind === 0) {
    const req = r1 + r2;
    const { options, correctIndex } = optionsAround(rng, req);
    return q("fisica", "circuitos", `Dos resistencias en serie: ${r1} Ω y ${r2} Ω. Req =`, options, correctIndex, `En serie Req = R₁+R₂ = ${req} Ω.`, 1, id("circuitos", i, seed));
  }
  if (kind === 1) {
    const req = (r1 * r2) / (r1 + r2);
    const rounded = Math.round(req * 100) / 100;
    const { options, correctIndex } = nOptions(rng, String(rounded), [String(r1 + r2), String(r1), String(Math.min(r1, r2)), "0"]);
    return q("fisica", "circuitos", `Dos resistencias en paralelo: ${r1} Ω y ${r2} Ω. Req ≈`, options, correctIndex, `Req = R₁R₂/(R₁+R₂) = ${rounded} Ω.`, 2, id("circuitos", i, seed));
  }
  const { options, correctIndex } = nOptions(rng, "La misma en todos los elementos", ["Se reparte inversamente", "Es nula", "Solo en el generador", "Mayor en la menor R"]);
  return q("fisica", "circuitos", "En un circuito serie, la corriente es:", options, correctIndex, "Una sola malla: misma I en todos.", 2, id("circuitos", i, seed));
}
