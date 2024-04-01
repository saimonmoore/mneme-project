import {
  MnemePublishers,
} from "@/lib/modules/Analysis/application/services/UrlCategorization";
import { UrlCategorizationProcessor } from "./processors/UrlCategorizationProcessor";
import { DefaultDocumentProcessor } from "./processors/DefaultDocumentProcessor";
import { GithubProcessor } from "./processors/GithubProcessor";
import { WikipediaProcessor } from "./processors/WikipediaProcessor";
import { YoutubeProcessor } from "./processors/YoutubeProcessor";
import { TwitterProcessor } from "./processors/TwitterProcessor";
import { InstagramProcessor } from "./processors/InstagramProcessor";

export type Url = string;
export type Tags = Array<string>;
export type HtmlDocument = {
  title: string;
  keywords: Array<string>;
  text: string;
};
export type HtmlDocumentWithTags = HtmlDocument & {
  tags: Tags;
};
export type MnemeDocument = {
  title: string;
  keywords: Array<string>;
  text: string;
  tags: Tags;
};

export class UrlAnalyser {
  private readonly defaultDocumentProcessor: DefaultDocumentProcessor;
  private readonly githubProcessor: GithubProcessor;
  private readonly wikipediaProcessor: WikipediaProcessor;
  private readonly youtubeProcessor: YoutubeProcessor;
  private readonly twitterProcessor: TwitterProcessor;
  private readonly instagramProcessor: InstagramProcessor;

  constructor() {
    this.githubProcessor = new GithubProcessor();
    this.wikipediaProcessor = new WikipediaProcessor();
    this.youtubeProcessor = new YoutubeProcessor();
    this.twitterProcessor = new TwitterProcessor();
    this.instagramProcessor = new InstagramProcessor();
    this.defaultDocumentProcessor = new DefaultDocumentProcessor();
  }

  async process(url: Url): Promise<MnemeDocument> {
    const urlCategorization = await new UrlCategorizationProcessor().process(
      url
    );

    switch (urlCategorization.publisher) {
      case MnemePublishers.GitHub:
        return await this.githubProcessor.process(urlCategorization);
      case MnemePublishers.Wikipedia:
        return await this.wikipediaProcessor.process(urlCategorization);
      case MnemePublishers.YouTube:
        return await this.youtubeProcessor.process(urlCategorization);
      case MnemePublishers.Twitter:
        return await this.twitterProcessor.process(urlCategorization);
      case MnemePublishers.Instagram:
        return await this.instagramProcessor.process(urlCategorization);
      default:
        return await this.defaultDocumentProcessor.process(urlCategorization);
    }
  }
}
