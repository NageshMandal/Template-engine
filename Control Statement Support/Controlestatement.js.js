// {{}}   -> Normal Variables
// {% %}  -> if else
// {# #}  -> for loops

[
  {
    condition: "($user.data == 1)",
    status: true,
    output: "<p> data 1   {{ $user.data }}!</p>",
    childCondition: [
      {
        condition: "($user.data == 1)",
        status: true,
        output: "<p> data 1   {{ $user.data }}!</p>",
        childCondition: [],
      },
    ],
  },
  {
    condition: "($user.data == 2)",
    status: false,
    output: "<p> data 1   {{ $user.data }}!</p>",
  },
  {
    condition: "($user.data == 2)",
    status: false,
    output: "<p> data 1   {{ $user.data }}!</p>",
  },
];

let entities = {
  quote : "	&quot",
  ampersand : "&amp"
}

let template = `<.html>
                  <header> 'quote' <header/>
                  {%if  ($user.data == 1) %} 
                            <p> data 1   {{ $user.data }}!</p>
                  {%elseif ($user.data == 2)  %}
                            <p> data 2 {{ $user.data }} </p>
                  {%elseif ($user.data == 3) %}
                            <p> data 3 {{ $user.data}} </p>
                  {%else  %}
                            <p> data 4 {{ $user.data}} </p>
                  {%endif%}
                <./html>`;

let data = {
  user: {
    data: 1,
  },
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
      if (mid == "%") {
        let next = template[i + 2];
        if (next == "i") {
          let fourth = template[i + 3];
          // conditional if else
          if (fourth == "f") {
            let currData = "";
            let pounter = i;

            while (
              !(
                template[pounter] == "{" &&
                template[pounter + 1] == "%" &&
                template[pounter + 2] == "e" &&
                template[pounter + 3] == "n" &&
                template[pounter + 4] == "d" &&
                template[pounter + 5] == "i" &&
                template[pounter + 6] == "f" &&
                template[pounter + 7] == "%" &&
                template[pounter + 8] == "}"
              )
            ) {
              currData += template[pounter];
              pounter++;
            }
            currData += "{%endif%}";

            // resolve condition
            let data = resolveControlCondition(currData, data);
            endData;
            pounter += 9;
            i = pounter;
          }
        }
      }
      // Handle control conditions here
      // else if (mid == "%") {
      //   let pointer = i + 2;
      //   let condition = "";
      //   while (template[pointer] != "%" && template[pointer + 1] != "}") {
      //     condition += template[pointer++];
      //   }
      //   let answer = resolveControlCondition(condition, data);
      //   endData += answer;
      //   i = pointer + 2;
      // }
    }
    else if (template[i] == "'"){

    }
    else {
      endData += template[i++];
    }
  }
  return endData;
}

function resolveControlCondition(condition, data, template) {
  let [control, variable] = condition.split(" ");
  let value = resolveExpression(variable, data, template);
  if (control === "if" && value) {
    let ifTrue = "";
    while (template[i] !== "{% else %}") {
      ifTrue += template[i++];
    }
    return ifTrue;
  } else if (control === "if" && !value) {
    let ifFalse = "";
    while (template[i] !== "{% endif %}") {
      i++;
      ifFalse += template[i++];
    }
    return ifFalse;
  }
}

function resolveExpression(expression, data, template) {
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

      variable = variable.trim().split("."); // split the variable by "." to handle nested data
      let nestedData = data;
      for (let j = 0; j < variable.length; j++) {
        nestedData = nestedData[variable[j]];
      }
      currData += nestedData;
      i = counter;
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

let res = templateEngine(template, data);
// document.write(res);
// console.log(res);
