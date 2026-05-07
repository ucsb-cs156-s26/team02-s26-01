const articlesFixtures = {
  oneArticle: {
    id: 1,
    title: "Sample Article Title",
    url: "https://example.com/articles/1",
    explanation: "This article explains the sample fixture format.",
    email: "author@example.com",
    dateAdded: "2026-05-02T12:00:00",
  },
  threeArticles: [
    {
      id: 1,
      title: "Sample Article Title",
      url: "https://example.com/articles/1",
      explanation: "This article explains the sample fixture format.",
      email: "author@example.com",
      dateAdded: "2026-05-02T12:00:00",
    },
    {
      id: 2,
      title: "Second Article Example",
      url: "https://example.com/articles/2",
      explanation: "A second article used for fixture coverage.",
      email: "second.author@example.com",
      dateAdded: "2026-04-25T09:30:00",
    },
    {
      id: 3,
      title: "Third Article Demo",
      url: "https://example.com/articles/3",
      explanation: "A third example article used for fixtures.",
      email: "third.author@example.com",
      dateAdded: "2026-04-18T17:45:00",
    },
  ],
};

export { articlesFixtures };
