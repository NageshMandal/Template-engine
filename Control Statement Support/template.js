const template = `{% if $user.authenticated %} 
                            <p>Welcome back, {{ $user.name }}!</p>
                        {% else %}
                            <p>Please <a href=""/login"">login</a> to access this page.</p>
                    {% endif %}`;
const data = {
    $user: {
        authenticated: true,
        name: "Nagesh Mandal"
    }
};


function controlTemplate(template, data) {
    let output = template;
    const conditions = template.match(/\{% if .+ %}(.|\n)+?{% endif %}/g);
  
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      const variable = condition.match(/\$\w+/)[0];
      const value = eval(`data.${variable}`); 
      const ifTrue = condition.match(/\{% if .+ %}(.|\n)+?(?=\{%)/)[0].replace("{% if ", "").replace(" %}", "");
      const ifFalse = condition.match(/(?<=\{%) else(.|\n)+?(?=\{%)/)[0].replace(" else", "");
      const newValue = value ? ifTrue : ifFalse;
      output = output.replace(condition, newValue);
    }
    
    return output;
  }
  
  

  const result = controlTemplate(template, data);
  document.write(result);



