const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "test@ucsb.edu",
    name: "Test Gaucho",
    tableOrBreakoutRoom: "table 01",
    requestTime: "2022-01-04T12:00:00",
    explanation: "Test explanation",
    solved: "false",
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "test1@ucsb.edu",
      name: "Test Gaucho",
      tableOrBreakoutRoom: "table 01",
      requestTime: "2022-01-01T12:00:00",
      explanation: "Test explanation 1",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "test2@ucsb.edu",
      name: "New Gaucho",
      tableOrBreakoutRoom: "table 02",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Test explanation 2",
      solved: "false",
    },
    {
      id: 3,
      requesterEmail: "test3@ucsb.edu",
      name: "Other Gaucho",
      tableOrBreakoutRoom: "table 03",
      requestTime: "2022-01-03T12:00:00",
      explanation: "Test explanation 3",
      solved: "true",
    },
  ],
};

export { helpRequestFixtures };
