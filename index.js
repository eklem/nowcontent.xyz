javascript:(function()
{
  var iframe   = document.createElement('iframe');
  iframe.name  = 'response';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  var form = document.createElement('form');
  form.style.visibility = 'hidden';
  form.method = 'post';
  form.action = 'https://hooks.zapier.com/hooks/catch/204265/1p9m8u/';
  form.target = 'response';

  input_url = document.createElement('input');
  input_url.name = 'url';
  input_url.value = window.location.href;
  form.appendChild(input_url);

  input_title = document.createElement('input');
  input_title.name = 'title';
  input_title.value = document.title;
  form.appendChild(input_title);

  document.body.appendChild(form);
  form.submit();}
)();
