function number(value) {
  return String(Math.round(value * 100) / 100);
}
const entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
const unsafeCharacter = /[&<>\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]|\p{Cs}/gu;
function escapeCharacter(character) {
  return entities[character] ?? "\uFFFD";
}
function escapeText(value) {
  return value.replace(unsafeCharacter, escapeCharacter);
}
function escapeAttribute(value) {
  return value.replace(unsafeCharacter, escapeCharacter).replace(/"/g, entities['"']);
}
export {
  escapeAttribute,
  escapeText,
  number
};
