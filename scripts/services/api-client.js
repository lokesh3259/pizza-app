async function donetworkcall() {
  const url =
    "https://raw.githubusercontent.com/Skill-risers/pizzajson/main/pizza.json";
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    throw err;
  }
}
export default donetworkcall;
