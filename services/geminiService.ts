
import { GoogleGenAI, Type } from "@google/genai";
import { QuizLevel, Quiz, ResultsData, Question } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLevelDetails = (level: QuizLevel) => {
  switch (level) {
    case QuizLevel.LEVEL_1:
      return {
        title: "英検2級〜準1級レベル",
        prompt: "英検2級から準1級レベルの典型的な文法・語彙問題を作成してください。過去5年の出題傾向を反映し、特に受験生が間違いやすいポイントを含めてください。",
        passageWords: 0,
      };
    case QuizLevel.LEVEL_2:
      return {
        title: "早稲田大学文学部レベル",
        prompt: "早稲田大学文学部の英語入試問題を想定し、約300語のアカデミックな長文を1つ作成し、それに関する読解問題を3問作成してください。本文のテーマや設問の形式は、過去5年の傾向を強く意識してください。",
        passageWords: 300,
      };
    case QuizLevel.LEVEL_3:
      return {
        title: "早稲田大学国際教養学部レベル",
        prompt: "早稲田大学国際教養学部(SILS)の英語入試問題を想定し、約500-600語の少し複雑な構成（複数の視点や抽象的な概念を含む）の長文を1つ作成し、それに関する深い読解と思考力を問う問題を3問作成してください。本文のテーマや設問の形式は、過去5年の傾向を強く意識してください。",
        passageWords: 500,
      };
  }
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        passage: { type: Type.STRING, description: '長文問題の文章。長文がない場合は空文字列。' },
        questions: {
            type: Type.ARRAY,
            description: '3つの設問の配列',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: '設問文' },
                    options: { 
                        type: Type.ARRAY, 
                        description: '4つの選択肢の配列', 
                        items: { type: Type.STRING }
                    },
                    correctAnswerIndex: { type: Type.INTEGER, description: '正解の選択肢のインデックス (0-3)' }
                },
                required: ['question', 'options', 'correctAnswerIndex']
            }
        }
    },
    required: ['passage', 'questions']
};


export const generateQuiz = async (level: QuizLevel, previousQuestions: string[]): Promise<Quiz> => {
    const levelDetails = getLevelDetails(level);

    const systemInstruction = `あなたは大学受験指導のエキスパートです。過去5年間の主要大学の入試問題と英検の傾向を完全に把握しています。これから指定されたレベルに応じて、高品質な英語の小テストを作成してください。JSON形式で厳密に出力してください。`;
    
    let userPrompt = `${levelDetails.prompt}\n\n`;
    if (previousQuestions.length > 0) {
        userPrompt += `注意：以下の問題とは異なる新しい問題を生成してください。\n${previousQuestions.join('\n')}`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: quizSchema,
            temperature: 1.0,
        }
    });

    const quizData = JSON.parse(response.text);
    
    const questions: Question[] = quizData.questions.map((q: any) => ({
      ...q,
      passage: quizData.passage || undefined,
    }));

    return {
        title: levelDetails.title,
        questions: questions
    };
};

const resultsSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: '正解数' },
        passageSummary: { type: Type.STRING, description: '長文問題の文章全体の要約。長文がない場合は空文字列。' },
        explanations: {
            type: Type.ARRAY,
            description: '各設問の詳細な解説の配列',
            items: {
                type: Type.OBJECT,
                properties: {
                    detailedExplanation: { type: Type.STRING, description: '正解の根拠、不正解の選択肢がなぜ違うのかを含む、受験生に分かりやすい詳細な解説' }
                },
                required: ['detailedExplanation']
            }
        },
        vocabulary: {
            type: Type.ARRAY,
            description: '問題全体から抽出した重要単語・成句のリスト',
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING, description: '単語または成句' },
                    meaning: { type: Type.STRING, description: '日本語での意味' },
                    example: { type: Type.STRING, description: 'その単語・成句を使った英語の例文' }
                },
                required: ['word', 'meaning', 'example']
            }
        }
    },
    required: ['score', 'explanations', 'vocabulary']
};


export const gradeAndExplain = async (quiz: Quiz, answers: number[], level: QuizLevel): Promise<ResultsData> => {
    const systemInstruction = `あなたは大学受験指導のエキスパートです。生徒が提出した小テストの答案を採点し、非常に丁寧で分かりやすい解説を作成します。解説は、生徒が「なぜ」を理解し、次に繋げられるように構成してください。JSON形式で厳密に出力してください。`;

    const isPassageQuiz = level === QuizLevel.LEVEL_2 || level === QuizLevel.LEVEL_3;
    const vocabCount = isPassageQuiz ? 10 : 5;

    const userPrompt = `
以下の小テストについて、採点と詳細な解説をお願いします。

**レベル:** ${quiz.title}

**問題と正解:**
${quiz.questions.map((q, i) => `
問題 ${i + 1}:
${q.passage ? `パッセージ: ${q.passage}\n` : ''}
設問: ${q.question}
選択肢: ${q.options.join(', ')}
正解: ${q.options[q.correctAnswerIndex]}
`).join('\n')}

**生徒の解答:**
${answers.map((ans, i) => `問題 ${i + 1}の解答: ${quiz.questions[i].options[ans]}`).join('\n')}

**指示:**
1.  **採点**: 3問中の正解数を計算してください。
${isPassageQuiz ? `2.  **文章要約**: パッセージ全体の要約を簡潔に作成してください。` : ''}
${isPassageQuiz ? '3.' : '2.'} **解説**: 各問題について、以下の要素を含む詳細な解説を作成してください。
    -   **詳細な解説**: なぜその答えが正解なのか、論理的な根拠を明確に示してください。また、他の選択肢がなぜ不正解なのかも具体的に説明してください。
${isPassageQuiz ? '4.' : '3.'} **重要単語・成句リスト**: 全ての問題文・パッセージから、大学受験で頻出の重要な単語や成句を${vocabCount}個選び出し、リストを作成してください。リストには「単語/成句」「日本語の意味」「英語の例文」を含めてください。
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: resultsSchema,
            temperature: 0.5,
        }
    });

    const resultsJson = JSON.parse(response.text);

    return {
        ...resultsJson,
        total: quiz.questions.length,
        level: level,
    };
};
