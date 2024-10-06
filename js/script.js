function addTask() {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.innerHTML = `
        <label>Task Name: <input type="text" class="taskName" required></label>
        <label>Hours: <input type="number" class="taskHours" required></label>
    `;
    document.getElementById('taskList').appendChild(taskDiv);
}

document.getElementById('invoiceForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const tasks = [];
    document.querySelectorAll('.task').forEach((taskElement) => {
        const name = taskElement.querySelector('.taskName').value;
        const hours = taskElement.querySelector('.taskHours').value;
        tasks.push({ name, hours });
    });

    const businessName = document.getElementById('businessName').value;
    const clientName = document.getElementById('clientName').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    let totalHours = 0;
    tasks.forEach((task) => {
        totalHours += parseFloat(task.hours);
    });

    const totalAmount = totalHours * hourlyRate;

    // Generate the PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Invoice for ${clientName}`, 10, 10);
    doc.text(`Business: ${businessName}`, 10, 20);
    doc.text(`Total Amount: $${totalAmount}.toFixed(2)`, 10, 30);

    tasks.forEach((task, index) => {
        doc.text(`${index + 1}. Task: ${task.name}, Hours: ${task.hours}`, 10, 40 + (index * 10));
    });

    doc.text('Payment Link:', 10, 70);
    doc.text('https://your-stripe-payment-link', 10, 80, { link: 'https://your-stripe-payment-url' });

    doc.save('invoice.pdf');
})