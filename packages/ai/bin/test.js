#!/usr/bin/env node

import { UrlAnalyzer } from '@mneme/ai';

const urlAnalyzer = new UrlAnalyzer(
  'https://fika.bar/blogs/paoramen/building-fika-constraints-and-architecture-01J3D106FEEKVQQ66CJ662RF92',
);

urlAnalyzer
  .analyze()
  .then((instance) => {
    console.log('Categorization: ', instance.categorization);
    console.log('Text (type): ', instance.type);
    console.log('Text (description): ', instance.description);
    console.log('Keywords: ', instance.keywords);
  })
  .catch((error) => {
    console.error('Error: ', error);
  });
