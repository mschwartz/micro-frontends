const objectToCSS = (o) => {
  return Object.keys(o).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      o[key] +
      ";",
    ""
  );
};

