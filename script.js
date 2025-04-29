   // Initialize cart
    let cart = [];
    let totalAmount = 0;
    const cartButton = document.getElementById("cart-button");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const modal = document.getElementById("checkout-modal");
    const closeModal = document.querySelector(".close-modal");
    const orderSummary = document.getElementById("order-summary");
    const modalTotal = document.getElementById("modal-total");
    const checkoutForm = document.getElementById("checkout-form");

    // Search functionality
    const searchBar = document.getElementById("search-bar");
    const dishes = document.querySelectorAll(".dish-card");

    searchBar.addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();
        dishes.forEach(dish => {
            const text = dish.textContent.toLowerCase();
            dish.style.display = text.includes(searchText) ? "block" : "none";
        });
    });

    // Vegetarian filter
    const vegetarianButton = document.getElementById("vegetarian");
    vegetarianButton.addEventListener("click", () => {
        dishes.forEach(dish => {
            const isVegetarian = dish.textContent.toLowerCase().includes("vegetarian");
            dish.style.display = isVegetarian ? "block" : "none";
        });
    });

    // Add to cart functionality
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const price = parseFloat(button.dataset.price);
            const name = button.dataset.name;
            const dishCard = button.closest(".dish-card");
            const imageSrc = dishCard.querySelector(".dish-image").style.backgroundImage;
            
            // Add to cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.total += price;
            } else {
                cart.push({
                    name,
                    price,
                    quantity: 1,
                    total: price,
                    image: imageSrc
                });
            }
            
            totalAmount += price;
            updateCartUI();
            
            // Visual feedback
            button.textContent = "Added!";
            button.style.backgroundColor = "#27ae60";
            setTimeout(() => {
                button.textContent = "Add to Cart";
                button.style.backgroundColor = "";
            }, 1000);
        });
    });

    // Cart button click
    cartButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        updateOrderSummary();
        modal.style.display = "block";
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Form submission
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        
        // In a real app, you would send this data to your backend
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: Object.fromEntries(formData),
            items: cart,
            total: totalAmount,
            date: new Date().toISOString()
        };
        
        console.log("Order submitted:", orderData); // For demonstration
        
        // Show confirmation
        alert(`Thank you for your order of ${totalAmount.toFixed(2)} MZN!\nWe'll contact you shortly.`);
        
        // Reset cart
        cart = [];
        totalAmount = 0;
        updateCartUI();
        modal.style.display = "none";
        checkoutForm.reset();
    });

    // Update cart UI
    function updateCartUI() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotal.textContent = `${totalAmount.toFixed(2)} MZN`;
    }

    // Update order summary in modal
    function updateOrderSummary() {
        orderSummary.innerHTML = "";
        
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "order-item";
            itemElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 50px; height: 50px; border-radius: 5px; background: ${item.image}; background-size: cover;"></div>
                    <span>${item.name}</span>
                </div>
                <div style="text-align: right;">
                    <div>${item.quantity} × ${item.price.toFixed(2)} MZN</div>
                    <div style="font-weight: bold;">${item.total.toFixed(2)} MZN</div>
                </div>
            `;
            orderSummary.appendChild(itemElement);
        });
        
        modalTotal.textContent = `${totalAmount.toFixed(2)} MZN`;
    }
});
