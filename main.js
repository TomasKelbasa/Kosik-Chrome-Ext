import fetchFromURL from "./rohlik_fetcher.js";

async function generateProduct(url, ix) {
	let d;
	await fetchFromURL(url).then((data) => d = data);

	let removeButton = document.createElement('button');
	removeButton.classList.add('product-removeBtn');
	removeButton.textContent = '-';
	removeButton.addEventListener('click', (ab) => {
		loadURLList((urlList) => {
			urlList[ix] = 'X';
			saveURLList(urlList);
		});
		document.querySelector(
			`[product-index="${ix}"]`
		)?.remove();
		
	});

	let product = document.createElement('div');
	product.classList.add("product-box");
	if(!d || !d.ok){
		product.textContent = "Neplatný produkt";
		product.appendChild(removeButton);
		return product;
	}
	product.textContent = d.name;


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
			});/*, async () => {
				

				parentN.innerHTML = '';
				if(divs.length > 0){
					divs.forEach((div) => {
						parentN.appendChild(div);
					});
				}else{
					let msg = document.createElement("p");
					msg.textContent = "No products on the list";
					parentN.appendChild(msg);
				}
				
			});*/
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
