import { categorizeUrl, UrlCategorization } from "@/lib/modules/Analysis/application/services/UrlCategorization";
import { Url } from "../UrlAnalyser";

export class UrlCategorizationProcessor {
    async process(url: Url): Promise<UrlCategorization> {
        const urlCategorization = await categorizeUrl(url);
        console.log(`[UrlCategorizationProcessor] ===========>`, {
            url,
            urlCategorization,
        });

        return urlCategorization;
    }
}
