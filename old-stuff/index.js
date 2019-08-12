  var iframe   = document.createElement('iframe');
  iframe.name  = 'response';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  // Setting up form
  var form = document.createElement('form');
  form.style.visibility = 'hidden';
  form.method = 'post';
  form.action = 'https://hooks.zapier.com/hooks/catch/204265/1p9m8u/';
  form.target = 'response';

  // URL
  input_url = document.createElement('input');
  input_url.name = 'url';
  input_url.value = window.location.href;
  form.appendChild(input_url);

  // title
  input_title = document.createElement('input');
  input_title.name = 'title';
  input_title.value = document.title;
  form.appendChild(input_title);

  // title
  input_body = document.createElement("input");
  input_body.name = 'body';
  console.dir(document.body.innerText);
  input_body.value = document.body.innerText;
  form.appendChild(input_body);

  // Adding form to document body
  document.body.appendChild(form);
  form.submit();
