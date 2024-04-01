import { HtmlDocumentExtractor } from "@/lib/modules/Analysis/application/services/Extractors/Html";
import { Url, HtmlDocument } from "../UrlAnalyser";

export class HtmlDocumentProcessor {
    async process(url: Url): Promise<HtmlDocument> {
        const htmlDocument = await HtmlDocumentExtractor.extract(url);
        console.log(`[HtmlDocumentProcessor] ===========>`, { url, htmlDocument });

        return htmlDocument;
    }
}
