function makeResourcesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      title: "Test Title 1",
      image_link:
        "https://images-na.ssl-images-amazon.com/images/I/51JwrB7zAcL._SX348_BO1,204,203,200_.jpg",
      language: "Korean",
      level: "Beginner",
      type: "Textbook",
      rating: 5,
      url: "http://www.test-url.com",
      cost: "Paid",
      description: "Test description...",
    },
    {
      id: 2,
      user_id: 1,
      title: "Test Title 2",
      image_link:
        "https://images-na.ssl-images-amazon.com/images/I/51JwrB7zAcL._SX348_BO1,204,203,200_.jpg",
      language: "Spanish",
      level: "Beginner",
      type: "Textbook",
      rating: 4,
      url: "http://www.test-url-2.com",
      cost: "Paid",
      description: "Test description 2...",
    },
    {
      id: 3,
      user_id: 1,
      title: "Test Title 3",
      image_link:
        "https://images-na.ssl-images-amazon.com/images/I/51JwrB7zAcL._SX348_BO1,204,203,200_.jpg",
      language: "Portuguese",
      level: "Advanced",
      type: "Workbook",
      rating: 4,
      url: "http://www.test-url-3.com",
      cost: "Paid",
      description: "Test description 3...",
    },
  ];
}

module.exports = { makeResourcesArray };
