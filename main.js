import fetchFromURL from "./rohlik_fetcher.js";

async function generateProduct(url, ix) {
	await fetchFromURL(url).then((d) => {
		console.log(d.name);

		let product = document.createElement('div');
		product.classList.add("product-box");
		product.textContent = d.name;

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
		return product;
	});





}

let productsEl = document.createElement('div');

async function generateProducts(products, callback) {
	let result = [];
	for(let i = 0; i < products.length; i++){
		result.push(await generateProduct(products[i], i));
	}
	return result;
	/*
	let promises = products.map(async (url, ix) => {
			await generateProduct(url, ix);
	});
	await Promise.all(promises);
	callback();
	*/
}


function listBuilder(){
	/*
		fetchFromURL("https://www.rohlik.cz/1406203-miil-cerstve-mleko-polotucne-1-5-tuku").then((data) => {
		console.log(data);
	});
*/

	
}


window.addEventListener('DOMContentLoaded', (event) => {
	loadURLList((ul) => {
		console.log('Rohlik-Chrome-Ext: Loaded URLs: ');
		listBuilder();
		console.log(ul);
		if (Array.isArray(ul)) {
			ul = ul.filter((el) => el != null && el != 'null' && el != 'X');
			saveURLList(ul);
			generateProducts(ul).then((result)=> console.log(result));/*, async () => {
				let parentN = document.querySelector('.prices');

				let divs = Array.from(productsEl.children);

				divs.sort((a, b) => {
					let ixA = parseInt(a.getAttribute('product-index'));
					let ixB = parseInt(b.getAttribute('product-index'));
					return ixA - ixB;
				});

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
