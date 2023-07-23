const getUserData = async () => {
  try {
    const response: any = [
      "Pineapple",
      "Peach",
      "Apple",
      "Watermelon",
      "Melon",
      "Guava",
      "Banana",
      "Orange",
      "Grape",
      "Kiwi",
      "Blueberry",
      "Blackberry",
      "Pear",
      "Tangerine",
      "Plum",
      "Mango",
      "Date",
      "Cantaloupe",
      "Strawberry",
      "Coconut"
    ];
    return Promise.resolve(response);
  } catch (error) {
    throw error;
  }
}

export default getUserData;