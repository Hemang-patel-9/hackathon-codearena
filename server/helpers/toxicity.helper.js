const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.7;

const detectToxicity = async (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('Invalid input: Expected a non-empty string.');
  }

  const model = await toxicity.load(threshold);

  const predictions = await model.classify([text]);

  const toxicLabels = predictions
    .filter(p => p.results[0].match)
    .map(p => p.label);

  if (toxicLabels.length > 0) {
    console.log("Toxic labels", toxicLabels);
    return true;
  } else {
    return false;
  }
};

module.exports = { detectToxicity };
