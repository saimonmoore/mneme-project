import { UrlCategorization } from "@/lib/modules/Analysis/application/services/UrlCategorization";
import { HtmlDocumentProcessor } from "./HtmlDocumentProcessor";
import { TagExtractorProcessor } from "./TagExtractorProcessor";
import { MnemeDocument, Url, HtmlDocument, HtmlDocumentWithTags } from "../UrlAnalyser";

export class DefaultDocumentProcessor {
    private readonly htmlDocumentProcessor: HtmlDocumentProcessor;
    private readonly tagExtractorProcessor: TagExtractorProcessor;

    constructor() {
        this.htmlDocumentProcessor = new HtmlDocumentProcessor();
        this.tagExtractorProcessor = new TagExtractorProcessor();
    }

    async process(urlCategorization: UrlCategorization): Promise<MnemeDocument> {
        const { url } = urlCategorization;
        const htmlDocument = await this.processDocument(url);
        const htmlDocumentWithTags = await this.processTags(htmlDocument);

        return htmlDocumentWithTags;
    }

    async processDocument(url: Url): Promise<HtmlDocument> {
        return await this.htmlDocumentProcessor.process(url);
    }

    async processTags(htmlDocument: HtmlDocument): Promise<HtmlDocumentWithTags> {
        return await this.tagExtractorProcessor.process(htmlDocument);
    }
}
