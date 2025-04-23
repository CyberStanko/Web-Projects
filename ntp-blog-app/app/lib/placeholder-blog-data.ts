import { Blog } from './definitions';

export const blogs: Blog[] = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    title: 'Virtual Personas for Language Models via an Anthology of Backstories',
    excerpt: 'What does it mean for large language models (LLMs) to be trained on massive text corpora, collectively produced by millions and billions of distinctive human authors?',
    content: 'What does it mean for large language models (LLMs) to be trained on massive text corpora, collectively produced by millions and billions of distinctive human authors?\n\nIn "Language Models as Agent Models", compelling evidence suggests that recent language models could be considered models of agents: provided with a textual context, LLMs are capable of generating conditional text that represents the characteristics of an agent likely to have produced that context. This suggests that, with appropriate conditioning, LLMs could be guided to approximate the responses of a particular human voice, rather than the mixture of voices that otherwise emerges. If realized, this capability of LLMs would have significant implications for user research and social sciences—conditioned language models as virtual personas of human subjects could serve as cost-effective pilot studies and supporting best practices in human studies, e.g. the Belmont principles of justice and beneficence.\n\nIn this work, we introduce Anthology, an approach for steering LLMs to representative, consistent, and diverse virtual personas by providing richly detailed life narratives of individuals as conditioning context to models.',
    author: 'Suhong Moon',
    image_url: '/blog_images/virtual_persona.png',
    published_date: '2025-01-15',
    status : 'published',
    slug:'virtual_personas_for_language_models'
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    title: 'Linguistic Bias in ChatGPT: Language Models Reinforce Dialect Discrimination',
    author: 'Eve Fleisig',
    excerpt: 'ChatGPT does amazingly well at communicating with people in English. But whose English?\n\nOnly 15% of ChatGPT users are from the US, where Standard American English is the default. But the model is also commonly used in countries and communities where people speak other varieties of English. Over 1 billion people around the world speak varieties such as Indian English, Nigerian English, Irish English, and African-American English.\n\nSpeakers of these non-"standard" varieties often face discrimination in the real world. They\'ve been told that the way they speak is unprofessional or incorrect, discredited as witnesses, and denied housing--despite extensive research indicating that all language varieties are equally complex and legitimate. Discriminating against the way someone speaks is often a proxy for discriminating against their race, ethnicity, or nationality. What if ChatGPT exacerbates this discrimination?', 
    content: 'ChatGPT does amazingly well at communicating with people in English. But whose English?\n\nOnly 15% of ChatGPT users are from the US, where Standard American English is the default. But the model is also commonly used in countries and communities where people speak other varieties of English. Over 1 billion people around the world speak varieties such as Indian English, Nigerian English, Irish English, and African-American English.\n\nSpeakers of these non-"standard" varieties often face discrimination in the real world. They\'ve been told that the way they speak is unprofessional or incorrect, discredited as witnesses, and denied housing--despite extensive research indicating that all language varieties are equally complex and legitimate. Discriminating against the way someone speaks is often a proxy for discriminating against their race, ethnicity, or nationality. What if ChatGPT exacerbates this discrimination?\n\nTo answer this question, our recent paper examines how ChatGPT\'s behavior changes in response to text in different varieties of English. We found that ChatGPT responses exhibit consistent and pervasive biases against non-"standard" varieties, including increased stereotyping and demeaning content, poorer comprehension, and condescending responses.',
    image_url: '/blog_images/linguistic_bias.png',
    published_date: '2025-01-10',
    status : 'published',
    slug:'linguistic_bias_in_chatgpt'
  }
];
