import 'dotenv/config'
import ort from "onnxruntime-web";
import {GoogleGenAI} from "@google/genai";

export async function classify(data) {
    const numberOfFeatures = data.length;
    const tensor = new ort.Tensor('float32', Float32Array.from(data), [1, numberOfFeatures]);

    // Load the pretrained model
    const session = await ort.InferenceSession.create("Classifier_Model.onnx");

    // Map the model input to the input tensor
    const mapping = {float_input: tensor};

    console.log(mapping);

    const results = await session.run(mapping)

    //get the output
    const outputVar = Object.keys(results)[0];
    const predictionBigInt = results[outputVar].data;
    const prediction = Array.from(predictionBigInt, Number);
    console.log(prediction[0])
    return prediction;
}

export async function regression(data) {
    const numberOfFeatures = data.length;
    const tensor = new ort.Tensor('float32', Float32Array.from(data), [1, numberOfFeatures]);

    // Load the pretrained model
    const session = await ort.InferenceSession.create("Regressor_Model.onnx");

    // Map the model input to the input tensor
    const mapping = {float_input: tensor};

    console.log(mapping);

    const results = await session.run(mapping)

    //get the output
    const outputVar = Object.keys(results)[0];
    const predictionBigInt = results[outputVar].data;
    const prediction = Array.from(predictionBigInt, Number);
    console.log(prediction)
    return prediction;
}

export async function recommendation(spendingCategory, forecastedSpending, forecastedBalance) {
    const agent = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    const spendingLevel = spendingCategory === 0 
                    ? "aggressive" 
                    : spendingCategory === 1
                    ? "mild"
                    : "defensive";
    const prompt = `
    A user come to you with a financial profile specified as below:
    1. The user's last 5 week spending is categorized as ${spendingLevel}.
    2. Based on the last 5 week spending habit, the user's spending on the next week is forecasted to be around ${forecastedSpending} Singapore Dollar.
    3. Based on the last 5 week spending habit, the user's balance on the next week is forecasted to be around ${forecastedBalance} Singapore Dollar.

    Based on the user profile stated above, advise the user with executable steps to either maintain or imporve the user's financial health.
    The advise must begin with a summary of the user financial profile and how the user's current profile will effect the user's financial condition in the future.
    The advise must not exceed 200 words.
    The advise must be stated in a step by step manner.
    End the advise with an encouraging statement
    `

    const recommendationText = await agent.models.generateContent(
        {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0,
                },
                systemInstruction: "You are a professional financial advisor. You must directly give advise as what the prompt is asking you. You are not allowed to ask any question."
            }
        }
    )

    console.log(recommendationText.text);

    return recommendationText.text;
}

const testInputClassify = [1533.63179194, 7554.03309488, 1435.69327901, 7170.55039617, 1303.13457716,
 7529.14483264, 1917.45378146, 9090.08344807, 1888.29391892, 5531.27976711,
 1615.6414697,  7375.01830777];

const testInputRegression = [1533.63179194, 7554.03309488, 1435.69327901, 7170.55039617, 1303.13457716,
 7529.14483264, 1917.45378146, 9090.08344807, 1888.29391892, 5531.27976711,
 1615.6414697,  7375.01830777, 2];

 //classify(testInputClassify);
 //regression(testInputRegression);
await recommendation(0,8932.45378146,9090.08344807);
