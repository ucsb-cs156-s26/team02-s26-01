const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "alex.johnson@ucsb.edu",
    professorEmail: "dr.smith@ucsb.edu",
    explanation: "Request for recommendation letter for graduate program",
    dateRequested: "2023-05-15T10:30:00",
    dateNeeded: "2023-08-20T15:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "maria.garcia@ucsb.edu",
      professorEmail: "prof.brown@ucsb.edu",
      explanation: "Letter of recommendation for internship opportunity",
      dateRequested: "2023-06-10T14:20:00",
      dateNeeded: "2023-09-15T12:00:00",
      done: true,
    },
    {
      id: 5,
      requesterEmail: "liam.wilson@ucsb.edu",
      professorEmail: "dr.davis@ucsb.edu",
      explanation: "Recommendation for PhD application at Stanford",
      dateRequested: "2023-07-22T09:45:00",
      dateNeeded: "2024-01-10T11:30:00",
      done: false,
    },
    {
      id: 7,
      requesterEmail: "sara.lee@ucsb.edu",
      professorEmail: "prof.taylor@ucsb.edu",
      explanation: "Letter for scholarship application",
      dateRequested: "2023-04-05T16:15:00",
      dateNeeded: "2023-11-30T13:45:00",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };