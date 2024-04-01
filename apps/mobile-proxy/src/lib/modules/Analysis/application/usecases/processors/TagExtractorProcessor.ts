import { TagExtractor } from "@/lib/modules/Analysis/application/services/Extractors/Tags";
import { HtmlDocument, HtmlDocumentWithTags } from "../UrlAnalyser";

export class TagExtractorProcessor {
    async process(htmlDocument: HtmlDocument): Promise<HtmlDocumentWithTags> {
        const tags = await TagExtractor.parseTags(htmlDocument.text);
        console.log(`[TagExtractorProcessor] ===========>`, {
            title: htmlDocument.title,
            htmlDocument,
        });

        return { ...htmlDocument, tags };
    }
}
