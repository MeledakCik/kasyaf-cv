import { ChallengeType } from "../types";

export const generateTextCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let value = "";
  for (let i = 0; i < 8; i++) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
};

export const generateMathChallenge = (): { question: string; answer: string } => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let answer: number;
  let displayQuestion: string;

  switch (operator) {
    case "+":
      answer = num1 + num2;
      displayQuestion = `${num1} + ${num2} = ?`;
      break;
    case "-":
      answer = num1 - num2;
      displayQuestion = `${num1} - ${num2} = ?`;
      break;
    case "×":
      answer = num1 * num2;
      displayQuestion = `${num1} × ${num2} = ?`;
      break;
    default:
      answer = num1 + num2;
      displayQuestion = `${num1} + ${num2} = ?`;
  }

  return { question: displayQuestion, answer: answer.toString() };
};

export const generateAudioCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < 4; i++) {
    value += chars[Math.floor(Math.random() * chars.length)];
  }
  return value;
};

export const getRandomChallengeType = (): ChallengeType => {
  const types: ChallengeType[] = ["text", "math", "audio"];
  return types[Math.floor(Math.random() * types.length)];
};