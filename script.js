// Memastikan keranjang diperbarui saat halaman dimuat
window.onload = function() {
    updateCartDisplay();
    setMaxPrice();
};
// Fungsi untuk menambahkan produk ke keranjang
function addToCart(name, price, imgSrc) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Cek apakah produk sudah ada dalam keranjang
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        // Jika ada, tambahkan kuantitasnya
        existingItem.quantity += 1;
    } else {
        // Jika belum ada, tambahkan produk baru ke keranjang
        cart.push({
            name: name,
            price: price,
            imgSrc: imgSrc,
            quantity: 1
        });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " telah ditambahkan ke keranjang!");
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();  // Memperbarui tampilan keranjang setelah penghapusan
}
// Fungsi untuk memformat harga dengan tanda mata uang
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
}

function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let totalPrice = 0;

    // Clear container terlebih dahulu
    cartItemsContainer.innerHTML = '';

    // Jika keranjang kosong, tampilkan pesan "Tidak ada barang"
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tidak ada barang</p>';
    } else {
        // Menambahkan item-item dalam keranjang
        cart.forEach(item => {
            let cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");  // Menggunakan class "cart-item"
            
            // Menghitung total harga per item
            let itemTotalPrice = item.price * item.quantity;

            cartItemDiv.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Harga per item: ${formatPrice(item.price)}</p>  <!-- Harga per item -->
                    <p>Jumlah: <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)"></p>
                    <p>Total Harga: ${formatPrice(itemTotalPrice)}</p>  <!-- Total harga per item -->
                    <button onclick="removeFromCart('${item.name}')">Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            totalPrice += itemTotalPrice;
        });
    }

    // Menampilkan total harga dengan format
    document.getElementById("total-price").innerText = `Total: ${formatPrice(totalPrice)}`;  // Format total harga
}

// Fungsi untuk mengupdate kuantitas item
function updateQuantity(productName, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = parseInt(quantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();  // Memperbarui tampilan setelah kuantitas diubah
    }
}

// Fungsi untuk filter produk berdasarkan kategori dan harga
function filterProducts() {
    let category = document.getElementById("category").value;
    let price = document.getElementById("price").value;

    // Ambil semua produk
    let products = document.querySelectorAll(".product-card");

    // Loop untuk menampilkan atau menyembunyikan produk berdasarkan kategori dan harga
    products.forEach(function(product) {
        let productCategory = product.getAttribute("data-category");
        let productPriceText = product.querySelector(".product-price").innerText;
        let productPrice = parseInt(productPriceText.replace('Rp ', '').replace('.', ''));

        // Filter produk berdasarkan kategori dan harga
        if ((category === "all" || category === productCategory) && productPrice <= price) {
            product.style.display = "block"; // Tampilkan produk
        } else {
            product.style.display = "none"; // Sembunyikan produk
        }
    });

    // Menampilkan kategori dan harga yang dipilih (optional)
    alert(`Menampilkan produk untuk kategori ${category} dengan harga di bawah Rp ${price}`);
}



// Fungsi untuk memperbarui nilai harga pada slider
document.getElementById("price").addEventListener("input", function() {
    document.getElementById("price-value").innerText = formatPrice(this.value); // Menampilkan harga yang dipilih
});


// Panggil fungsi untuk menyesuaikan slider saat halaman dimuat

function formatPrice(price) {
    return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Fungsi untuk menyesuaikan nilai maksimum harga berdasarkan produk
function setMaxPrice() {
    let products = document.querySelectorAll(".product-card");
    let maxPrice = 0;

    // Mencari harga maksimum dari produk
    products.forEach(function(product) {
        let productPriceText = product.querySelector(".product-price").innerText;
        let productPrice = parseInt(productPriceText.replace('Rp ', '').replace('.', ''));
        if (productPrice > maxPrice) {
            maxPrice = productPrice;
        }
    });

    // Menyesuaikan nilai maksimum slider harga
    document.getElementById("price").max = maxPrice;
    document.getElementById("price-value").innerText = formatPrice(maxPrice); // Menampilkan harga maksimum
}function searchproduct() {
    let searchTerm = document.getElementById("search-input").value.toLowerCase();
    let productCards = document.querySelectorAll(".product-card");
    
    let foundProduct = false; // Flag untuk memeriksa apakah ada produk yang cocok
    
    productCards.forEach(product => {
        let productName = product.querySelector("h3").textContent.toLowerCase();
        let productCategory = product.getAttribute("data-category").toLowerCase();
        
        // Memeriksa apakah nama produk atau kategori cocok dengan kata kunci pencarian
        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            product.style.display = "block"; // Menampilkan produk yang cocok
            foundProduct = true; // Menandakan bahwa ada produk yang cocok
        } else {
            product.style.display = "none"; // Menyembunyikan produk yang tidak cocok
        }
    });

    // Menampilkan atau menyembunyikan pesan jika tidak ada produk yang ditemukan
    let noProductsMessage = document.getElementById("no-products-message");
    if (!foundProduct) {
        noProductsMessage.style.display = "block"; // Menampilkan pesan
    } else {
        noProductsMessage.style.display = "none"; // Menyembunyikan pesan
    }
}

