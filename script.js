function subjects() {
  var x = parseInt(document.getElementById("subjects").value);
  var htmlContent = ""; // Create an empty string to store HTML elements

  for (let index = 0; index < x; index++) {
    htmlContent += `
      <h3>Subject ${index + 1}</h3>
      <label for="subjectname${index}">Subject Name:</label>
      <input type="text" id="subjectname${index}"><br>
      <label for="grade${index}">Grade:</label>
      <select id="grade${index}">
        <option value="">Select Grade</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="F">F</option>
      </select>
      <label for="credit_hour_${index}">Credit Hour:</label>
      <input type="text" id="credit_hour_${index}" placeholder="Credit Hour">
      <br>`;
  }

  document.getElementById("inputs").innerHTML = htmlContent;
}

function calculateGPA() {
  var totalQualityPoints = 0;
  var totalCreditHours = 0;

  var numSubjects = parseInt(document.getElementById("subjects").value);

  for (let index = 0; index < numSubjects; index++) {
    var grade = document.getElementById("grade" + index).value;
    var creditHour = parseFloat(document.getElementById("credit_hour_" + index).value);

    if (!grade || !creditHour) {
      alert("Please fill in all subject grades and credit hours.");
      return;
    }

    // Determine grade point based on the selected grade
    var gradePoint;
    switch (grade) {
      case 'A+':
        gradePoint = 4.0;
        break;
      case 'A':
        gradePoint = 3.5;
        break;
      case 'B+':
        gradePoint = 3.0;
        break;
      case 'B':
        gradePoint = 2.5;
        break;
      case 'C+':
        gradePoint = 2.0;
        break;
      case 'C':
        gradePoint = 1.0;
        break;
      case 'F':
        gradePoint = 0.0;
        break;
      default:
        alert("Invalid grade selection for subject " + (index + 1));
        return;
    }

    var qualityPoints = gradePoint * creditHour;
    totalQualityPoints += qualityPoints;
    totalCreditHours += creditHour;
  }

  var gpa;
  if (totalCreditHours > 0) {
    gpa = totalQualityPoints / totalCreditHours;
    gpa = gpa.toFixed(2); 
    document.getElementById("gpa_result").value = gpa;
    document.getElementById("qualityPoints").value = totalQualityPoints;
  } else {
    alert("No credit hours entered. GPA cannot be calculated.");
  }
}
function downloadReport() {
  // 1. Get data from input fields
  const subjectNames = [];
  const grades = [];
  const creditHours = [];

  const numSubjects = parseInt(document.getElementById("subjects").value);
  for (let i = 0; i < numSubjects; i++) {
    subjectNames.push(document.getElementById(`subjectname${i}`).value);
    grades.push(document.getElementById(`grade${i}`).value);
    creditHours.push(parseFloat(document.getElementById(`credit_hour_${i}`).value));
  }

  // 2. Calculate Quality Points (assuming a basic conversion)
  const qualityPoints = [];
  const gradeMap = {
    "A+": 4.0,
    A: 4.0,
    "B+": 3.5,
    B: 3.0,
    "C+": 2.5,
    C: 2.0,
    F: 0.0,
  };
  for (let grade of grades) {
    qualityPoints.push(gradeMap[grade] || 0); // handle cases where grade is not in map
  }

  // 3. Calculate Total GPA, Credit Hours, and Quality Points
  let totalGPA = 0;
  let totalCreditHours = 0;
  let totalQualityPoints = 0;
  for (let i = 0; i < numSubjects; i++) {
    totalCreditHours += creditHours[i];
    totalQualityPoints += qualityPoints[i] * creditHours[i];
  }
  totalGPA = totalQualityPoints / totalCreditHours;

  // 4. Generate report data in CSV format
  let reportData = `Subject Name,Grade,Credit Hours,Quality Points\n`;
  for (let i = 0; i < numSubjects; i++) {
    reportData += `${subjectNames[i]},${grades[i]},${creditHours[i]},${qualityPoints[i]}\n`;
  }
  reportData += `Total GPA, ,${totalCreditHours},${totalQualityPoints}\n`;
  
  // 5. Create a Blob object with the report data
  const blob = new Blob([reportData], { type: "text/csv;charset=utf-8" });

  // 6. Create a downloadable URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // 7. Simulate a click on a hidden anchor element to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "GPA_Report.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // 8. Clean up the temporary URL
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
