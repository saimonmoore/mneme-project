import { request } from '@/infrastructure/http/request.js';

import {
  AIAnalysis,
  AIAnalysisInputDto,
} from '@/modules/AI/domain/entities/AIAnalysis';
import { Logger } from '@/infrastructure/logging/logger.js';

const logger = Logger.getInstance();

type AnalysisResult = {
  data: {
    result: AIAnalysisInputDto;
  };
};

export class AnalysisUseCase {
  static async analyse(url: string): Promise<AIAnalysis> {
    const result = await request('http://localhost/ai/analyze', {
      method: 'POST',
      body: { url },
    });

    const analysis = new AIAnalysis((result as AnalysisResult)?.data?.result as AIAnalysisInputDto);

    return analysis;
  }
}
