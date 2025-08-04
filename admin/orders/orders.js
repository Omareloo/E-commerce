window.addEventListener('DOMContentLoaded',()=>{
    loadorders();
})
async function loadorders() {
    var tbody = document.querySelector('.orders-list tbody');
    if (!tbody) return;
  const snapshot = await db.collection("orders").get();
    tbody.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    // const row = document.createElement("tr");
    const row = `
      <td>${data.name}</td>
      <td>${data.price}</td>
      <td>${data.quantity}</td>
      <td>${data.orderStatus}</td>
    <td>
    <button class="edit-btn" onclick="accept('${doc.id}')">Accept</button>
    <button class="delete-btn" onclick="reject('${doc.id}')">Reject</button>
    </td>
    `;
    tbody.innerHTML+= row;
  });
}

async function accept(id) {
    try {
        await db.collection("orders").doc(id).update({
            orderStatus: "Accepted"
        });
        loadorders();
    } catch (error) {
        console.error("Error updating order status: ", error);

    }
}
async function reject(id) {
    try {
        await db.collection("orders").doc(id).update({
            orderStatus: "Rejected"
        });
         loadorders();
    } catch (error) {
        console.error("Error updating order status: ", error);

    }
}
