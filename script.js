let photoData = '';

document.getElementById('photo').addEventListener('change', function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    photoData = e.target.result;
    updateResume();
  };
  if (this.files[0]) {
    reader.readAsDataURL(this.files[0]);
  }
});

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<em>$1</em>")
    .replace(/\+\+(.*?)\+\+/g, "<u>$1</u>")
    .replace(/\n/g, "<br>");
}

function updateResume() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const objective = document.getElementById('objective')?.value || "";
  const education = document.getElementById('education').value;
  const experience = document.getElementById('experience').value;
  const projects = document.getElementById('projects').value;
  const skills = document.getElementById('skills').value;
  const template = document.getElementById('templateSelect').value;

  const photoHTML = photoData
    ? `<div class="photo"><img src="${photoData}" alt="Profile Photo" /></div>`
    : '';

  const output = `
    <div class="resume-header">
      ${photoHTML}
      <div class="resume-name">
        <h2>${name}</h2>
        <p>📧 ${email}</p>
        <p>📞 ${phone}</p>
        <p>📍 ${formatText(address)}</p>
      </div>
    </div>

    <div class="resume-section"><h3>Objective</h3><p>${formatText(objective)}</p></div>
    <div class="resume-section">
      <h3>Education</h3>
      <table class="edu-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Institute/Board</th>
            <th>CGPA/Percentage</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          ${education.split('\n').map(row => {
            const cols = row.split(',');
            return `
            <tr>
              <td>${cols[0]?.trim() || ''}</td>
              <td>${cols[1]?.trim() || ''}</td>
              <td>${cols[2]?.trim() || ''}</td>
              <td>${cols[3]?.trim() || ''}</td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="resume-section"><h3>Skills</h3><p>${formatText(skills)}</p></div>
    <div class="resume-section"><h3>Projects</h3><p>${formatText(projects)}</p></div>
    <div class="resume-section"><h3>Experience</h3><p>${formatText(experience)}</p></div>
  `;

  const outputDiv = document.getElementById('resumeOutput');
  outputDiv.className = '';
  outputDiv.classList.add(template);
  outputDiv.innerHTML = output;
}

document.querySelectorAll("textarea").forEach(textarea => {
  textarea.addEventListener("keydown", function (e) {
    if (e.ctrlKey) {
      const key = e.key.toLowerCase();
      let wrapper = '';

      if (key === 'b') wrapper = '**';
      else if (key === 'i') wrapper = '__';
      else if (key === 'u') wrapper = '++';

      if (wrapper) {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const selected = this.value.substring(start, end);
        const before = this.value.substring(0, start);
        const after = this.value.substring(end);
        this.value = `${before}${wrapper}${selected}${wrapper}${after}`;
        this.selectionStart = start + wrapper.length;
        this.selectionEnd = end + wrapper.length;
        updateResume();
      }
    }
  });
});

function downloadPDF() {
  const element = document.getElementById('resumeOutput');
  const opt = {
    margin: 0,
    filename: 'My_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1.3 }, // 👈 Important: scale for accurate fit
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

window.onload = updateResume;
