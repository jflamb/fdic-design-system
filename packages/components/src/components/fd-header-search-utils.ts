export interface HeaderSearchAliasData {
  parentheticalAliases: string[];
  derivedAcronyms: string[];
}

export function normalizeHeaderSearchText(value: string | undefined): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getParentheticalSegments(value: string): string[] {
  const segments: string[] = [];
  let depth = 0;
  let start = -1;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character === "(") {
      if (depth === 0) {
        start = index + 1;
      }
      depth += 1;
      continue;
    }

    if (character === ")") {
      if (depth === 0) {
        continue;
      }

      depth -= 1;
      if (depth === 0 && start >= 0 && index > start) {
        segments.push(value.slice(start, index));
      }
    }
  }

  return segments;
}

function stripParentheticalSegments(value: string): string {
  let result = "";
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character === "(") {
      if (depth === 0) {
        result += " ";
      }
      depth += 1;
      continue;
    }

    if (character === ")") {
      if (depth > 0) {
        depth -= 1;
        if (depth === 0) {
          result += " ";
        }
        continue;
      }
    }

    if (depth === 0) {
      result += character;
    }
  }

  return result;
}

export function extractHeaderSearchAliasData(label: string): HeaderSearchAliasData {
  const parentheticalAliases = new Set<string>();
  const derivedAcronyms = new Set<string>();
  const rawLabel = String(label || "");

  getParentheticalSegments(rawLabel).forEach((match) => {
    const normalizedMatch = normalizeHeaderSearchText(match);
    if (!normalizedMatch) {
      return;
    }

    parentheticalAliases.add(normalizedMatch);
    normalizedMatch.split(" ").forEach((token) => {
      if (token.length >= 2) {
        parentheticalAliases.add(token);
      }
    });
  });

  const acronymSource = normalizeHeaderSearchText(
    stripParentheticalSegments(rawLabel),
  );
  const acronymWords = acronymSource
    .split(" ")
    .filter(
      (word) =>
        word &&
        !["a", "an", "and", "for", "of", "the", "to"].includes(word),
    );

  if (acronymWords.length >= 2) {
    derivedAcronyms.add(acronymWords.map((word) => word[0]).join(""));
  }

  return {
    parentheticalAliases: [...parentheticalAliases],
    derivedAcronyms: [...derivedAcronyms],
  };
}
