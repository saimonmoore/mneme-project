import mql from '@microlink/mql';

import type { MqlResponse } from '@microlink/mql';
import { MnemePublishers } from '@/lib/modules/Analysis/application/services/UrlCategorization/UrlCategorizer';
import type { UrlCategorization } from '@/lib/modules/Analysis/application/services/UrlCategorization/UrlCategorizer';

function callMicroLink(url: string): Promise<MqlResponse> {
  return mql(url) as unknown as Promise<MqlResponse>;
}

function correctPublisher(publisher?: string): string | undefined {
  if (!publisher) return;

  if (publisher === 'Wikimedia Foundation, Inc.') {
    return MnemePublishers.Wikipedia;
  }

  return publisher;
}

export async function categorizeUrlViaMicrolink(
  url: string
): Promise<UrlCategorization> {
  const { data } = await callMicroLink(url);

  return {
    url,
    publisher: correctPublisher(data.publisher || undefined),
    title: data.title || undefined,
    description: data.description || undefined,
    image: data.image?.url || undefined,
    logo: data.logo?.url || undefined,
    language: data.lang || undefined,
  };
}
