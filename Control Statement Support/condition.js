const template = `<html>
                  {% if user.authenticated %} 
                            <p>Welcome back, {{ user.name }}!</p>
                        {% else %}
                            <p>Please <a href="/login">login</a> to access this page.</p>
                  {% endif %}
                  </html>`;

const data = {
  user: {
    authenticated: true,
    name: "Nagesh Mandal"
  }
};

function templateEngine(template, data) {
  let output = template;

  // Replace variables in template with data
  const varRegex = /\{\{(.*?)\}\}/g;
  output = output.replace(varRegex, (match, varName) => {
    return eval(`data.${varName}`);
  });

  // Replace control flow statements in template with appropriate output
  const controlRegex = /\{%(.*?)%\}/g;
  output = output.replace(controlRegex, (match, control) => {
    const [controlType, condition] = control.trim().split(" ");
    if (controlType === "if") {
      if (eval(condition)) {
        return match.replace("{% if", "").replace("%}", "");
      } else {
        // Find the else block and return it
        const elseIndex = template.indexOf("{% else %}");
        return template.slice(elseIndex + "{% else %}".length, template.indexOf("{% endif %}"));
      }
    }
  });

  return output;
}

console.log(templateEngine(template, data));
