import { RecordLanguage, RecordType } from "@mneme/domain";
import { Record, RecordInputDto } from "@mneme/desktop/domain/Record/Record";
import { Tag, TagInputDto } from "@mneme/desktop/domain/Tag/Tag";
import { Keyword, KeywordInputDto } from "@mneme/desktop/domain/Keyword/Keyword";

export const mockURLs = [
    {
        url: "https://www.google.com",
        type: RecordType.HTML,
        language: RecordLanguage.ENGLISH,
        tags: [{ label: "p2p" }],
        keywords: [{ label: "search" }, { label: "engine" }],
    },
    {
        url: "https://www.youtube.com",
        type: RecordType.YOUTUBE,
        language: RecordLanguage.ENGLISH,
        tags: [{ label: "video" }],
        keywords: [{ label: "video" }, { label: "youtube" }],
    },
    {
        url: "https://www.twitter.com",
        type: RecordType.TWITTER,
        language: RecordLanguage.ENGLISH,
        tags: [{ label: "tweet" }],
        keywords: [{ label: "twitter" }, { label: "social" }],
    },
    {
        url: "https://www.pdf.com",
        type: RecordType.PDF,
        language: RecordLanguage.ENGLISH,
        tags: [{ label: "document" }],
        keywords: [{ label: "pdf" }, { label: "adobe" }],
    },
];

export const mockRecords = () => mockURLs.map((record: RecordInputDto) => {
    return Record.create({
        url: record.url,
        type: record.type,
        language: record.language,
        tags: Tag.createCollection(record.tags as TagInputDto[]),
        keywords: Keyword.createCollection(record.keywords as KeywordInputDto[]),
    });
});