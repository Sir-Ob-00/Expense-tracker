const API_URL = "http://localhost:3000/api/expenses";

/* -------------------- LOAD ALL -------------------- */
async function loadExpenses() {
    const res = await fetch(API_URL);
    const result = await res.json();

    const expenses = result.data || result;
    displayExpenses(expenses);
    loadTotal();
}

/* -------------------- DISPLAY -------------------- */
function displayExpenses(expenses) {
    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach(exp => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${exp.title}</td>
            <td>GHS ${exp.amount.toFixed(2)}</td>
            <td>${exp.category}</td>
            <td>${new Date(exp.date).toLocaleDateString()}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense('${exp._id}')">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);
    });
}

/* -------------------- ADD -------------------- */
document.getElementById("expenseForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expense = {
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    });

    e.target.reset();
    loadExpenses();
});

/* -------------------- DELETE -------------------- */
async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadExpenses();
}

/* -------------------- TOTAL -------------------- */
async function loadTotal() {
    const res = await fetch(`${API_URL}/total`);
    const data = await res.json();
    document.getElementById("totalAmount").innerText =
        `GHS ${data.total.toFixed(2)}`;
}

/* -------------------- FILTER CATEGORY -------------------- */
async function filterByCategory() {
    const category = document.getElementById("filterCategory").value;
    if (!category) return;

    const res = await fetch(`${API_URL}/category/${category}`);
    const result = await res.json();
    displayExpenses(result.data || result);
}

/* -------------------- FILTER DATE -------------------- */
async function filterByDate() {
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    if (!start || !end) return alert("Select both dates");

    const res = await fetch(`${API_URL}/range?start=${start}&end=${end}`);
    const result = await res.json();

    displayExpenses(result.data || result);
}

/* -------------------- INIT -------------------- */
loadExpenses();