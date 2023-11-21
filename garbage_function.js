//processing string
function message_process(sting) {
  const myString = sting;
  const wordsToCheck = ["cek", "barang"];

  const lowercaseString = myString.toLowerCase();

  const result = wordsToCheck.every((word) =>
    lowercaseString.includes(word.toLowerCase())
  );
  return result;
}
