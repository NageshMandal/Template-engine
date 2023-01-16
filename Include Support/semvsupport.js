let template = `<.html>
                  <h2>{{ $name  }}</h2>
                  <p>{{ $quantity * $price }}</p>
                  <p>{{ $quantity + $price }}</p>
                  <p>{{ $quantity - $price }}</p>
                  <p>{{ $quantity / $price }}</p>
                  <p>Total cost:{{ $quantity * $price }}</p>
                  {% include "./header.js" %}
                <./html>`;


let data = {
  name: "Nagesh Mandal",
  quantity: "5",
  price: "9",
};

// O(n) complexity
// dont be fooled by multiple loops
async function templateEngine(template, data) {
  let endData = "";
  let i = 0;
  while (i < template.length) {
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
    // Variable Support and expression
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
        i = pointer + 3;
      }
      // hanlde includes here
      else if (mid == "%") {
        let includes = "";
        let pointer = i + 2;

        while (template[pointer] != "}") {
          includes += template[pointer];
          pointer++;
        }
        let subData = await includesHandler(includes, data);
        endData += subData;
        pointer++;
        i = pointer;
      }
    }
    else {
      endData += template[i++];
    }
  }
  return endData;
}

// Handle includes
async function includesHandler(includes, data) {
  let endData;

  includes = includes.trim();
  let res = includes.split(" ");
  let command = res[0];
  if (command == "include") {
    let loc = res[1].replaceAll('"', "");
    let file;
    // node js
    if (typeof window === "undefined") {
      console.log("node js");
      file = (await import(loc))["header"];
    } else {


    }
    // vannila js
    console.log(file);

    endData = await templateEngine(file, data);

    return endData;
  } else {
  }
}

// O(n) complexity
// you can use your regex here as it contain codes now that is to be evaluated
function resolveExpression(expression, data) {
  let currData = "";
  let isExpression = false;

  for (let i = 0; i < expression.length; ) {
    const element = expression[i];

    if (element === "$") {
      let variable = "";
      let counter = i + 1;
      let currChar = expression[counter];

      while (currChar !== " " && currChar !== "\0") {
        variable += currChar;
        currChar = expression[++counter];

        if (currChar === undefined) break;
      }

      variable = variable.trim();
      currData += data[variable];
      i = counter;
    } else if (
      element === "+" ||
      element === "-" ||
      element === "*" ||
      element === "/" ||
      element === "(" ||
      element === ")"
    ) {
      currData += element;
      i++;
      isExpression = true;
    } else {
      i++;
    }
  }

  if (isExpression) {
    // use eval to evaluate the expression
    return eval(currData);
  } else {
    return currData;
  }
}

// function fetchIncludedFile(fileName) {
//   return fetch('header.pari')
//     .then((response) => response.text())
//     .catch((error) => console.error("An error occurred while fetching the file: ", error));
// }
async function start() {
  let res = await templateEngine(template, data);
  console.log(res);
}

start();
