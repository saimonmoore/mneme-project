import { sha256 } from '@/infrastructure/helpers/hash.js';

// {
//   "data": {
//     "result": {
//       "url": "https://fika.bar/blogs/paoramen/building-fika-constraints-and-architecture-01J3D106FEEKVQQ66CJ662RF92",
//       "categorization": {
//         "publisher": "fika.bar",
//         "title": "paoramen - Building fika: Constraints and Architecture",
//         "description": "First article on the building fika series, where I explain in excruciating detail how it is built",
//         "image": "https://fika-assets.b-cdn.net/post-images/01J3D106FEEKVQQ66CJ662RF92/image-5784135364885397843.webp?class=post",
//         "logo": "https://fika.bar/favicon.ico",
//         "language": "en"
//       },
//       "text": "  \n            \n\n\n\n\n\n\n\n\n        \n          \ntitle && ()\n  paoramen   \ntitle && ()\n   Building fika: Constraints and Architecture  First article on the building fika series, where I explain in excruciating detail how it is built    Jul 23, 2024   In this series of articles, I’m going to explain how fika is built. I’ve learned a lot building it and I would love to share these learnings with y’all.ConstraintsWhen I started this project, I wanted to build something different. I didn’t start by identifying a pain or target audience, and I didn’t have any economic incentive at all. I just wanted to explore, craft, and learn. For this reason I set myself the following constraints:Local-first: I’ve been frustrated with building applications with manual state transfer. They are hard to build, slow, and error prone. When Ink & Switch published the local-first article, many people who were exploring the same problems got together and started to share ideas. I wanted to be part of that movement.Web based: Never bet against the web. Despite all its shortcomings as a platform, users demand apps to be in it; native applications are not enough.Affordable: Software is increasingly expensive, and more so now that ZIRP is over and companies are rushing to become profitable. I want to build products for the long tail, which means that the price per user should be negligible.Above all, I wanted to maximize learning, to get more experience with Python, machine learning, design, CSS, and new frontend frameworks. So I didn’t try very hard to optimize for “the right tool for the job” and instead aimed for “the most fun as long as it gets the job done”.The problemSo with these constraints cleared, I decided to find a problem easy enough to experiment with.I’m a person who curates and shares a lot of content in private communities, and after reading The Expanding Dark Forest and Generative AI an idea popped in my head: I would build a product for people like me that enjoy bringing information from the dark forest to the cozy web.The infographic depicts email and RSS as the protocols of exchange in that liminal space. This then gave me the idea of putting together 3 products in one: a bookmark manager, an RSS reader, and a blogging platform. A way to save, subscribe to, and publish content.Obviously, I was overly optimistic. The project turned out to be a classic case of “We don’t do this because it’s easy, but because we thought it would be easy”. It turns out that building a bookmark manager or an RSS feed is not easy. And doing both, pretty hard. I spent most of the time fighting pipelines and processing HTML, which was not my initial goal whatsoever. But hey, this was by far one of the most fun I had while building software, so I won’t complain.The architecturefika's architecture in 4 layersClientOne of the decisions I was very clear about from the beginning, was that fika should be built on top of a syncing engine. This would allow me to have offline and realtime capabilities, but most importantly, a declarative data layer. No more fetch libraries, cascading, suspenses, caching, or loading states.I will write a deep dive in sync engines in another post, but after trying most players in the space, I decided to roll up my sleeves and implement a Python backend for Replicache. I knew I wanted an authoritative server backed by a DB, so Replicache seemed to be the best fit for the use case. While I’m extremely happy with the outcome, I have to tell you that it wasn’t an easy task: The documentation is very sparse and the code is not open source so you end up reverse-engineering the examples. But when you make it work, it works fantastically.On top of Replicache I built a very thin layer with Solid so I could have all the state in memory as signals. This incurs a memory cost but I’m convinced that the trade-off is worth it. The UX of zero latency apps is unparalleled, not to mention the DX gains you get from this pattern. The team behind Replicache is working on a new approach called Zero, which probably will replace this layer at some point.// a client-side reactive db eradicates most state management\nconst titles = db.bookmark\n  .sortBy('bookmarked_at', 'desc')\n  .map((bookmark) => {\n    const storyId = bookmark.story_id\n    const story = db.story.findBy({ id: storyId})\n\n    return story?.dc_title || 'Untitled'\n  })\n\nreturn (\n  <For each={titles}>\n    {title => <Text>{title}</Text>\n  </For>\n)Solid has been one of my biggest surprises. It works extremely well and the APIs are very well thought out. Local-first apps are the most stateful apps one can build, so having fine-grained reactivity saves you a lot of headaches with under/over rendering in React. Once you grasp the model – which is fairly easy if you’ve used MobX – all those issues vanish. Things render exactly when you expect them to render. Fantastic.API service and jobsThe backend is implemented in Python with FastAPI. Coming from Ruby and wrestling with Sorbet for several years, Python’s type hints felt like a blessing. But after working enough with them, it is clear that the type system is actually not that great: you can’t really model a domain with algebraic datatypes since there are no union types, and generics are rather clumsy. That being said, I was positively impressed with Pydantic and the ecosystem around it.For the bookmark processing pipeline and RSS fetching, I experimented with durable execution vendors, settling with Inngest. The pattern is very interesting and it leads to a more declarative way of writing your jobs and a more robust handling of failures. Nevertheless, these tools are a bit pricey for the volume of this product, so eventually I might try harder to make Celery work with asyncio or just host my own Temporal instance. Python sync/async divide is dramatic, I would switch to Typescript if I were to start over again.Fetcher serviceI wanted to be able to read the bookmarks directly from fika, but because of the same-origin policy and X-Frame-Options headers, you can’t just fetch or embed any website you want in the browser. Contrary to native applications that can fetch any origin and embed whatever they want in a web view, this is one of the biggest limitations of the web platform. Since building for the web was one of the constraints, I had to build a service to fetch and extract metadata from websites.Not only that, if I wanted people to download the bookmarks to read offline, I had to process them heavily, removing everything but content and compressing images. To store these html files for offline access, I end up using the Origin Private File System inside a web worker.SearchFor full-text search, I started building hybrid search in the backend. I went down the rabbit hole of “you just need Postgres” which turned out to be a major disappointment. Also, costs for embeddings are too high for the unit economics I was aiming for. On top of this, a backend search implementation would mean to give up offline search. And since local-first was one of the constraints, I ended up implementing the search in the client.I built another web worker to index all the content in orama. Thanks to having Replicache as a sync engine, this was very easy to implement. Data comes in from the server, and the sync engine sends it to the web worker to be indexed straight away. I ended up giving up semantic search, but eventually I will implement it with transformers-js.// this 3 lines is all you need to ensure all your data will be forwarded elsewhere\nreplicache.experimentalWatch((diffs) => {\n  sync.postMessage({ type: 'indexStories', diffs })\n}, { initialValuesInFirstDiff: true })Database and infrastructureTo implement the syncing engine, I needed a way to listen to database changes in realtime. For that reason I went with Supabase. This combined with RLS policies makes the syncing engine completely transparent to the developer. Any write in the DB pings affected users to pull fresh data. Magic.For the hosting, I went with a mix between Cloudflare and fly.io.Cloudflare: I have the domains, everything JavaScript related and most importantly, R2.Fly.io: I run the api and fetcher services. Once I can remove the dependency of jsdom completely, I will probably move the fetcher to Cloudflare to avoid doing redirects to R2 for egress cost saving.Lastly, I do all the image optimizations through bunny. For $9.5, this is by far the cheapest image transformation CDN you can have.Public pageFinally, I implemented the public page using Astro. I wanted to see what the hype was about, but I will probably unify both the public page and the client app under a single Solid Start codebase.CodaI hope you enjoyed this article! I will get much deeper in further episodes, so stay tuned.Thanks for reading, Pao.    \n© 2024 fika\n \ntitle && ()\n \ncreate your own blog\n    ",
//       "description": "First article on the building fika series, where I explain in excruciating detail how it is built",
//       "type": "text/html",
//       "keywords": [
//         "fika",
//         "local-first",
//         "sync engine"
//       ]
//     }
//   }
// }

import { KeywordInputDto } from '@/modules/Record/domain/dtos/KeywordInputDto';
import { RecordLanguage, RecordType } from '@mneme/domain';

type AnalysisCategorization = {
  publisher: string;
  title: string;
  description: string;
  image: string;
  logo: string;
  language: RecordLanguage;
};

export type AIAnalysisInputDto = {
  url: string;
  categorization: AnalysisCategorization;
  text: string;
  description: string;
  keywords: string[];
  type: string;
};

export type AIAnalysisOutputDto = AIAnalysisInputDto & {
  keywords: KeywordInputDto[];
};

export class AIAnalysis {
  url: string;
  categorization: AnalysisCategorization;
  text: string;
  description: string;
  private _keywords: string[];
  private _type: string;

  constructor(analysis: AIAnalysisInputDto) {
    this.url = analysis.url;
    this.categorization = analysis.categorization;
    this.text = analysis.text;
    this.description = analysis.description;
    this._keywords = Array.from(analysis.keywords || []);
    this._type = analysis.type;
  }

  get keywords(): KeywordInputDto[] {
    return this._keywords.map((keyword) => ({
      label: keyword,
      hash: sha256(keyword),
    }));
  }

  get type(): RecordType {
    let recordType: RecordType;

    switch (this._type) {
      case 'text/html':
        switch (this.categorization?.publisher) {
          case 'GitHub':
            recordType = RecordType.GITHUB;
            break;
          case 'Bluesky Social':
            recordType = RecordType.BLUESKY;
            break;
          case 'Twitter':
            recordType = RecordType.TWITTER;
            break;
          case 'X':
            recordType = RecordType.TWITTER;
            break;
          case 'YouTube':
            recordType = RecordType.YOUTUBE;
            break;
          default:
            recordType = RecordType.HTML;
            break;
        }

        recordType = recordType || RecordType.HTML;
        break;
      case 'application/pdf':
        recordType = RecordType.PDF;
        break;
      default:
        recordType = RecordType.UNKNOWN;
        break;
    }

    return recordType;
  }
}
