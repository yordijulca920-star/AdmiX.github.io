import type { CourseId, Question } from "@/lib/models/types";
import { generateAlgebra } from "./algebra";
import { generateAritmetica } from "./aritmetica";
import { generateFisica } from "./fisica";
import { generateGeometria } from "./geometria";
import { generateRazonamiento } from "./razonamiento";
import { generateTrigonometria } from "./trigonometria";

export function generateQuestions(
  courseId: CourseId,
  topicId: string,
  count: number,
  seed: number,
): Question[] {
  switch (courseId) {
    case "razonamiento":
      return generateRazonamiento(topicId, count, seed);
    case "fisica":
      return generateFisica(topicId, count, seed);
    case "algebra":
      return generateAlgebra(topicId, count, seed);
    case "geometria":
      return generateGeometria(topicId, count, seed);
    case "trigonometria":
      return generateTrigonometria(topicId, count, seed);
    case "aritmetica":
      return generateAritmetica(topicId, count, seed);
    default:
      return generateRazonamiento(topicId, count, seed);
  }
}
