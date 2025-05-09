let svgx, dotx, els = [], count = 0
const labels = [
  ['Right', 'Left'], ['Left', 'Right'], ['Body <br> back', 'Body <br> front'], ['Body <br> front', 'Body <br> back']
]
//Init
const input = document.querySelector('textarea')
const history = document.querySelector('.history')
const form = history.querySelector('form')
const submit = document.querySelector('#submit')
const title = document.querySelector('.slider .title')
const left_label = document.querySelector('.slider .left')
const right_label = document.querySelector('.slider .right')
const svg_box = document.querySelector('.svg_box')
const r8_btn = document.querySelector('img.right')
const l8_btn = document.querySelector('img.left')
const dot_box = document.querySelector('.dots')
const dots = document.querySelectorAll('.dot')
const cards_btn = document.querySelector('button#show_cards')
const close_btn = document.querySelector('button#close')
dotx = dot_box.firstElementChild

//fetch svgs
const files = get_imgs();
files.forEach((text, i) => {
  const temp = document.createElement('div')
  temp.innerHTML = text
  svg_box.append(temp.firstElementChild)
  if(!i)
    svgx = svg_box.firstElementChild
  const paths = svg_box.lastElementChild.querySelectorAll('path')
  const rects = svg_box.lastElementChild.querySelectorAll('rect')
  const polygons = svg_box.lastElementChild.querySelectorAll('polygon')
  paths.forEach(click)
  rects.forEach(click)
  polygons.forEach(click)
})

//listeners
// input.onkeydown = e => {e.key === 'Enter' && onsubmit(e)}
cards_btn.onclick = () => history.classList.add('show')
close_btn.onclick = () => history.classList.remove('show')
submit.onclick = onsubmit
dots.forEach(dot_click)
r8_btn.onclick = r8_click
l8_btn.onclick = l8_click


//functions
function dot_click (dot, i) {
  dot.onclick = () => {
    svgx.classList.remove('show')
    dotx.classList.remove('on')
    dotx = dot
    svgx = svg_box.children[i] 
    title.innerHTML = svgx.id
    svgx.classList.add('show')
    dotx.classList.add('on')
  }
}
function r8_click () {
  svgx.classList.remove('show')
  dotx.classList.remove('on')
  if(svgx.nextElementSibling){
    count++
    svgx = svgx.nextElementSibling
    dotx = dotx.nextElementSibling
  }
  else{
    count = 0
    svgx = svg_box.firstElementChild
    dotx = dot_box.firstElementChild
  }
  title.innerHTML = svgx.id
  left_label.innerHTML = labels[count][1]
  right_label.innerHTML = labels[count][0]
  svgx.classList.add('show')
  dotx.classList.add('on')
}
function l8_click () {
  svgx.classList.remove('show')
  dotx.classList.remove('on')
  if(svgx.previousElementSibling){
    count--
    svgx = svgx.previousElementSibling
    dotx = dotx.previousElementSibling
  }
  else{
    count = 3
    svgx = svg_box.lastElementChild
    dotx = dot_box.lastElementChild
  }
  title.innerHTML = svgx.id
  left_label.innerHTML = labels[count][1]
  right_label.innerHTML = labels[count][0]
  svgx.classList.add('show')
  dotx.classList.add('on')
}
function click (el) {
  el.onclick = () => {
    el.classList.toggle('on')
    // const id = el.parentElement.parentElement.parentElement.id+' '+el.id
    // if(id in els){
    //   els = els.filter(v => v !== id)
    //   input.disabled = Boolean(els.length)
    //   input.placeholder = 'Pick a body part to add symptoms'
    // }
    // else{
    //   if(!els.length){
    //     input.disabled = false
    //     input.placeholder = 'Enter symptoms here'
    //   }
    //   els.push(id)
    // }
  }
}
function onsubmit (e) {
  // Fill the report with form data
  e.preventDefault()

  // Check if any element with class 'cls-1' also has the 'on' class
  if (!document.querySelector('.cls-1.on')) {
    alert("Please select a body section before submitting the form.");
    return;
  }

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const desc = document.getElementById('desc').value;

  if(!form.checkValidity()){
    form.reportValidity()
    return
  }

  report.querySelector('#report-name').innerText = firstname + ' ' + lastname;
  report.querySelector('#report-email').innerText = email;
  report.querySelector('#report-desc').innerText = desc;

  const today = new Date().toLocaleString();
  report.querySelector('#report-date').innerText = today;
  
  const reportImages = report.querySelector('#report-images');
  const labels = ['Body Front', 'Body Back', 'Right-hand side', 'Left-hand side']
  Array.from(reportImages.children).forEach((child, i) => {
    child.innerHTML = svg_box.children[i].outerHTML
    const label = document.createElement('div')
    label.classList.add('label')
    label.innerHTML = labels[i]
    child.append(label)
  })
  // Generate and download the image
  
  html2canvas(report).then(function(canvas) {
    canvas.toBlob(function(blob) {
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('email', email);
      formData.append('desc', desc);
      formData.append('image', blob, 'medical-report.png');

      fetch("https://phpstack-1311192-4904597.cloudwaysapps.com/send-email",{
        method: 'POST',
        body: formData
      }).then(response => {
        if(response.ok){
          alert('Email sent successfully!');
          window.location.href = 'https://www.sydneypain.com.au/';
        } else {
          alert('Error sending email');
        }
      }).catch(error => {
        console.error('Error:', error);
        alert('Error sending email');
    });
  });
  });

  document.getElementById("modal-container").style.display = 'flex';
}
const report = document.createElement('div')
report.id = 'report'
document.body.append(report)
report.innerHTML = `
  <h1>Medical Report</h1>
  <div class="details">
    <div><strong>Name:</strong> <span id="report-name"></span></div>
    <div><strong>Email:</strong> <span id="report-email"></span></div>
  </div>
  <div class="details">
    <div><strong>Date:</strong> <span id="report-date"></span></div>
    <div class="description">
      <strong>Description:</strong> <span id="report-desc"></span>
    </div>
  </div>
  <div class="images" id="report-images">
    <div></div><div></div><div></div><div></div>
  </div>
`