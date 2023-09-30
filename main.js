import fetchFromURL from "./rohlik_fetcher.js";

async function generateProduct(url, ix) {
	let d;
	await fetchFromURL(url).then((data) => d = data);
	

	let product = document.createElement('div');
	product.classList.add("product-box");
	product.innerHTML = `
	<a href="${url}" target="_blank" class="product-name">${d.name}</a>
	<div class="product-priceBox">
		<p class="product-price ${d.inSale ? "inSale" : ""}">${d.price ? d.price : "unaivailible"} ${d.beforePrice ? "<del>" + d.beforePrice + "</del>" : ""}</p>
		<button class="product-removeBtn">-</button>
	</div>
	
	`;
	let removeButton = product.querySelector('.product-removeBtn');
	removeButton.addEventListener('click', (ab) => {
		loadURLList((urlList) => {
			urlList[ix] = 'X';
			saveURLList(urlList);
		});
		product.remove();
	});

	/*if(!d || !d.ok){
		product.textContent = "Neplatný produkt";
		product.appendChild(removeButton);
		return product;
	}*/

	return product; 
}

async function generateProducts(products) {

	let result = products.map((product, ix)=>{
		return generateProduct(product, ix);
	});
	let resolved = await Promise.all(result);
	return resolved;
}
//fetchFromURL("https://www.rohlik.cz/1376951-thomy-holandska-omacka").then((result) => console.log(result))
window.addEventListener('DOMContentLoaded', (event) => {
	loadURLList((ul) => {
		
		console.log('Rohlik-Chrome-Ext: Loaded URLs: ');
		console.log(ul);

		if (Array.isArray(ul)) {
			ul = ul.filter((el) => el != null && el != 'null' && el != 'X');
			saveURLList(ul);
			let parentN = document.querySelector('.prices');
			generateProducts(ul).then((result)=> {
				parentN.innerHTML = "";
				if(result.length == 0) parentN.innerHTML = "No products on the list";

				result.forEach(element => {
					parentN.appendChild(element);
				});
			});
		}
	});
});


function saveURLList(urlList) {
	chrome.storage.sync.set({ myURLs: urlList }, function () {
		if (chrome.runtime.lastError) {
			console.error('Chyba při ukládání dat: ' + chrome.runtime.lastError);
		} else {
			console.log('Rohlik-Chrome-Ext: URL list has been saved');
		}
	});
}

async function loadURLList(callback) {
	await chrome.storage.sync.get('myURLs', function (data) {
		if (chrome.runtime.lastError) {
			console.error('Chyba při načítání dat: ' + chrome.runtime.lastError);
			callback([]);
		} else {
			const urlList = data.myURLs || [];
			const urlStrings = urlList.map((url) => String(url));
			callback(urlStrings);
		}
	});
}
