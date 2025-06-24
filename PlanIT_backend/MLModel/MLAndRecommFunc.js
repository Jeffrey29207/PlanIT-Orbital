import ort from "onnxruntime-web"

export async function classify(data) {
    const numberOfFeatures = data.length;
    const tensor = new ort.Tensor('float32', Float32Array.from(data), [1, numberOfFeatures]);

    // Load the pretrained model
    //const session = await ort.InferenceSession.create("Classifier_Model.onnx");
    const session = await ort.InferenceSession.create("./MLModel/Classifier_Model.onnx");

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
    //const session = await ort.InferenceSession.create("Regressor_Model.onnx");
    const session = await ort.InferenceSession.create("./MLModel/Regressor_Model.onnx");


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

const testInputClassify = [1533.63179194, 7554.03309488, 1435.69327901, 7170.55039617, 1303.13457716,
 7529.14483264, 1917.45378146, 9090.08344807, 1888.29391892, 5531.27976711,
 1615.6414697,  7375.01830777];

const testInputRegression = [1533.63179194, 7554.03309488, 1435.69327901, 7170.55039617, 1303.13457716,
 7529.14483264, 1917.45378146, 9090.08344807, 1888.29391892, 5531.27976711,
 1615.6414697,  7375.01830777, 2];

 classify(testInputClassify);
 regression(testInputRegression);