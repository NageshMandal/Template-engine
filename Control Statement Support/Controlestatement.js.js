let template = `<.html>
                  {% if $user.authenticated %} 
                            <p>Welcome back, {{ $user.name }}!</p>
                        {% else %}
                            <p>Please <a href=""/login"">login</a> to access this page.</p>
                    {% endif %}
                <./html>`;

let data = {
  user: {
    authenticated: true,
    name: "Nagesh Mandal"
  }
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
    // Handle control conditions here
    else if (mid == "%") {
      let pointer = i + 2;
      let condition = "";
      while (template[pointer] != "%" && template[pointer + 1] != "}") {
        condition += template[pointer++];
      }
      let answer = resolveControlCondition(condition, data);
      endData += answer;
      i = pointer + 2;
    }
  } else {
    i++;
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
document.write(res);

