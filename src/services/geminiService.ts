import { TumorClass } from "../types";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeMedicalImage = async (image: string): Promise<{
    tumorClass: TumorClass;
    confidence: number;
    explanation: string;
}> => {
    console.log("Analyzing image...", image.substring(0, 50) + "...");

    // Simulate API call delay
    await delay(2000);

    // TODO: Connect to actual Python backend at localhost:5000
    // const response = await fetch('http://localhost:5000/predict', ...);

    // For now, return mock result
    // Randomize slightly for demo purposes
    const isMalignant = Math.random() > 0.3;
    const confidence = 85 + Math.random() * 14;

    return {
        tumorClass: isMalignant ? TumorClass.MALIGNANT : TumorClass.BENIGN,
        confidence: parseFloat(confidence.toFixed(1)),
        explanation: isMalignant
            ? "Automated analysis detects irregular cellular boundaries and nuclear atypia consistent with malignant tissue. High mitotic count observed in upper quadrant."
            : "Tissue morphology appears normal. No evidence of irregular cellular structures or nuclear atypia. Benign classification with high confidence."
    };
};
