import { z } from "zod";

import { ChatAnthropicTools } from "@langchain/anthropic/experimental";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import type { Tags } from "@/lib/modules/Analysis/application/usecases/UrlAnalyser";

export class TagExtractor {
  static async parseTags(input: string): Promise<Tags> {
    const EXTRACTION_TEMPLATE =
      `Categorize the following text into tags such that I can later search for certain tags to find the text.` +
      `Return the 5 most relevant tags in a JSON array, ` +
      `including any important product/framework names that are central to the content.` +
      `Tags do not need to be a single word and should not include non-alphanumeric symbols.` +
      `Tags should only be derived from the words/phrases directly present in the given text,` +
      `without making any conceptual leaps or assumptions beyond that.` +
      `Tags should be concise short phrases (max 2 or three words while preferring 1 word unless the meaning is lost)` +
      `that accurately describe the key topics and concepts covered in the text,` +
      `avoiding redundancy with other tags as well as marketing language or catchphrases.` +
      `Explicitly only output the JSON array without any accompanying text,prose,analysis.` +
      `Exclude proper nouns referring to specific applications or websites,` +
      `unless they represent the core product/framework itself in which case ensure it is present once.` +
      ` Text: ` +
      `{input}`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", EXTRACTION_TEMPLATE],
      ["user", "{input}"],
    ]);

    const schema = z.array(
      z
        .string()
        .describe("A tag that best describes the essence of the text."),
    );

    const model = new ChatAnthropicTools({
      temperature: 0.1,
      modelName: "claude-3-sonnet-20240229",
    });

    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);
    const response = await chain.invoke({ input });

    let tags;

    try {
      tags = JSON.parse(response);
    } catch (error) {
      console.error("Error parsing tags", error);
    }

    return tags;
  }
}
