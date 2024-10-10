// script.js

// Function to add a new task row
function addTask() {
    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.innerHTML = `
      <label>
        Task Name:
        <input type="text" class="taskName" required>
      </label>
      <label>
        Hours:
        <input type="number" class="taskHours" required>
      </label>
      <button type="button" class="deleteTask">x</button>
    `;
    taskList.appendChild(taskDiv);
  
    // Add event listener to the new delete button
    taskDiv.querySelector('.deleteTask').addEventListener('click', () => {
      taskDiv.remove();
    });
  }
  
  // Function to generate the payment link
  async function generatePaymentLink() {
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
    const tasks = document.querySelectorAll('.taskHours');
    let totalHours = 0;
  
    tasks.forEach(task => {
      totalHours += parseFloat(task.value);
    });
  
    try {
      const response = await fetch('http://localhost:3000/create-payment-link', {
      // const response = await fetch('/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hourlyRate,
          quantity: totalHours,
        }),
      });
  
      const data = await response.json();
      console.log("DATA: " + data);
      if (data.paymentLink) {
        document.getElementById('paymentLink').href = data.paymentLink;
        document.getElementById('paymentLinkContainer').classList.remove('hidden');
  
        // Generate the PDF after getting the payment link
        generatePDF(hourlyRate, totalHours, data.paymentLink);
      } else {
        alert('Failed to create payment link');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert('An error occurred. Please try again.');
    }
  }
  
  // Function to generate PDF using jsPDF
  function generatePDF(hourlyRate, totalHours, paymentLink) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const businessName = document.getElementById('businessName').value;
    const clientName = document.getElementById('clientName').value;
    const tasks = document.querySelectorAll('.task');
  
    let yOffset = 20;
  
    // Add title
    doc.setFontSize(18);
    doc.text('Invoice', 105, yOffset, { align: 'center' });
    yOffset += 10;
  
    // Add Business and Client info
    doc.setFontSize(12);
    doc.text(`Business: ${businessName}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Client: ${clientName}`, 20, yOffset);
    yOffset += 10;
  
    // Add Tasks table header
    doc.text('Tasks:', 20, yOffset);
    yOffset += 10;
    doc.text('Task Name', 20, yOffset);
    doc.text('Hours', 150, yOffset);
    yOffset += 5;
  
    // Add each task to the PDF
    tasks.forEach(task => {
      const taskName = task.querySelector('.taskName').value;
      const taskHours = task.querySelector('.taskHours').value;
      doc.text(taskName, 20, yOffset);
      doc.text(taskHours, 150, yOffset);
      yOffset += 10;
    });
  
    // Add summary
    doc.text(`Total Hours: ${totalHours}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Hourly Rate: $${hourlyRate.toFixed(2)}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Total Amount: $${(hourlyRate * totalHours).toFixed(2)}`, 20, yOffset);
    yOffset += 20;
  
    // Add payment link
    doc.text('Payment Link:', 20, yOffset);
    doc.textWithLink(paymentLink, 20, yOffset + 10, { url: paymentLink });
    yOffset += 20;
  
    // Save the PDF
    doc.save(`${clientName}_invoice.pdf`);
  }
  
  // Event listener for deleting tasks
  document.querySelectorAll('.deleteTask').forEach(button => {
    button.addEventListener('click', (event) => {
      event.target.parentElement.remove();
    });
  });
  