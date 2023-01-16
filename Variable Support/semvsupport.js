let template = `<.html><h2>{{ $name  }}</h2><./html>`;

let data = {
  name: "Brajesh Mishra",
};

// O(n) complexity
// dont be fooled by multiple loops
function templateEngine(template, data) {
  let templateLength = template.length;
  let endData = "";
  for (let i = 0; i < templateLength; ) {
    let curr = template[i];

    // console.log(curr);
    // base case
    if (curr == "<") {
      let mid = template[i + 1];
      if (mid === ".") {
        let next = template[i + 2];
        // End of file
        if (next === "/") {
          let tag = "</";
          let pointer = i + 3;
          while (template[pointer] != ">") {
            tag += template[pointer];
            pointer++;
          }
          tag += ">";
          endData += tag;
          i = pointer + 1;
        }
        // start of the file
        else {
          let pointer = i + 2;

          let tag = "<";
          while (template[pointer] != ">") {
            tag += template[pointer];
            pointer++;
          }
          tag += ">";
          endData += tag;
          i = pointer + 1;
        }
      }
      // middle of the file
      else {
        let pointer = i + 1;
        let tag = "<";
        while (template[pointer] != ">") {
          tag += template[pointer];
          pointer++;
        }
        tag += ">";
        endData += tag;
        i = pointer + 1;
      }
    }
    // Variable Support
    else if (curr == "{") {
      let mid = template[i + 1];
      // Handle Variables here
      if (mid == "{") {
        let pointer = i + 2;
        let expression = "";
        while (template[pointer] != "}" && template[pointer + 1] != "}") {
          expression += template[pointer++];
        }
        let answer = resolveExpression(expression, data);
        endData += answer;
        i = pointer + 2;
      }
    } else {
      i++;
    }
  }

  return endData;
}

// O(n) complexity
// you can use your regex here as it contain codes now that is to be evaluated
function resolveExpression(expression, data) {
  let currData = "";

  for (let i = 0; i < expression.length; ) {
    const element = expression[i];

    if (element === "$") {
      let variable = "";
      let counter = i + 1;

      let currChar = expression[counter];
      while (currChar !== " " || currChar !== "\0") {
        variable += currChar;
        currChar = expression[++counter];
        if (currChar == undefined) break;
      }

      console.log("variable", variable);
      variable = variable.trim()

      currData += data[variable];
      i = counter;
    } else {
      i++;
    }
  }

  return currData;
}

let res = templateEngine(template, data);
console.log(res);
