#!/usr/bin/env node

import { KeywordExtraction } from '@mneme/ai';


// Get first argument as number of keywords to extract

const numKeywords = process.argv[2] ? parseInt(process.argv[2], 10) : 3;

console.log(`Extracting ${numKeywords} keywords from test article...`);

const TEST_ARTICLE = 'sqlite-vec is a new vector search SQLite extension written entirely in C with no dependencies, MIT/Apache-2.0 dual licensed. The first "stable" v0.1.0 release is here, meaning that it is ready for folks to try in their own projects! There are many ways to install it across multiple package managers, and will soon become a part of popular SQLite-related products like SQLite Cloud and Turso. Try it out today!';

const keywordExtraction = new KeywordExtraction(TEST_ARTICLE, numKeywords);
keywordExtraction.extractKeywords().then((instance) => {
  console.log(instance.keywords);
}).catch((error) => {
  console.error(error);
});