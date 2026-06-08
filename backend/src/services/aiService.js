import { pipeline } from '@xenova/transformers';
import logger from '../config/logger.js';

let sentimentPipeline = null;

async function getPipeline() {
  if (!sentimentPipeline) {
    logger.info('Initializing local AI sentiment pipeline (DistilBERT)...');
    try {
      // SST-2 DistilBERT is lightweight (~260MB) and very fast
      sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      logger.info('AI sentiment pipeline initialized successfully.');
    } catch (err) {
      logger.error('Failed to initialize AI pipeline, using basic fallback:', err.message);
      throw err;
    }
  }
  return sentimentPipeline;
}

export async function analyzeSentiment(texts) {
  try {
    const classifier = await getPipeline();
    const results = await classifier(texts);
    
    return results.map((res, i) => {
      // SST-2 returns POSITIVE or NEGATIVE
      const isPositive = res.label === 'POSITIVE';
      return {
        text: texts[i],
        sentiment: isPositive ? 'Bullish' : 'Bearish',
        confidence: res.score * 100,
        tone: isPositive ? 'positive' : 'negative'
      };
    });
  } catch (err) {
    logger.warn('AI Sentiment analysis failed, using rule-based keyword sentiment:', err.message);
    return texts.map(text => {
      const lower = text.toLowerCase();
      const bullishKeywords = ['rise', 'growth', 'gain', 'profit', 'surge', 'bull', 'up', 'positive', 'high', 'strong'];
      const bearishKeywords = ['fall', 'drop', 'loss', 'slump', 'bear', 'down', 'negative', 'low', 'weak', 'risk'];
      
      let score = 0.5;
      bullishKeywords.forEach(k => { if (lower.includes(k)) score += 0.15; });
      bearishKeywords.forEach(k => { if (lower.includes(k)) score -= 0.15; });
      
      const isBullish = score >= 0.5;
      return {
        text,
        sentiment: isBullish ? 'Bullish' : 'Bearish',
        confidence: Math.min(95, Math.max(55, Math.abs(score) * 100)),
        tone: isBullish ? 'positive' : 'negative'
      };
    });
  }
}
