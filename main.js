async function generateProduct(url, ix) {
	if (url) {
		await fetch(url)
			.then((response) => response.text())
			.then((data) => {
				
				//converts only body of fetched HTML to HTML
				let dc = new DOMParser().parseFromString(
					data.split('<body>')[1],
					'text/html'
				);
				dc = dc.querySelector("#productDetail");
				if (dc.querySelector('h2') && dc.querySelector('.detailQuantity')) {
					let priceInput = dc.querySelector('[data-test="product-price"]');
					let inSale = false;
					if (priceInput) {
						let priceInput = dc.querySelector('[data-test="product-price"]');
						inSale = Boolean(priceInput.classList.contains("actionPrice"));
						if (priceInput.querySelector('span') !== null) {
							priceInput.removeChild(priceInput.querySelector('span'));
						}
					}
					let nameInput = dc.querySelector('h2');
					let brandInput = nameInput.querySelector('.iscxvd');
					nameInput.querySelector('.iscxvd')?.remove();

					let detailInput = dc.querySelector('.detailQuantity');

					let newDiv = document.createElement('div');
					newDiv.classList.add('product-box');
					newDiv.setAttribute('product-index', ix);

					let productName = document.createElement('a');
					productName.className = 'product-name';
					productName.href = url;
					productName.target = '_blank';
					productName.textContent =
						nameInput.textContent + ' - ' + detailInput?.textContent;

					newDiv.appendChild(productName);

					let priceBox = document.createElement('div');
					priceBox.classList.add('product-priceBox');

					let productPrice = document.createElement('p');
					productPrice.className = 'product-price';


					if (priceInput){
						if(inSale){
							productPrice.classList.add("inSale");
							let beforePrice = dc.querySelector('[data-test="product-in-sale-original"]').textContent;
							productPrice.innerHTML = `${priceInput.textContent.trim()} <del>${beforePrice}</del>`;
						}else{
							productPrice.innerHTML = `${priceInput.textContent.trim()}`;
						}
					}
					else productPrice.textContent = 'currently unavailable';
					priceBox.appendChild(productPrice);

					let removeButton = document.createElement('button');
					removeButton.classList.add('product-removeBtn');
					removeButton.textContent = '-';
					removeButton.addEventListener('click', (ab) => {
						loadURLList((urlList) => {
							urlList[ix] = 'X';
							saveURLList(urlList);
						});
						const elementToRemove = document.querySelector(
							`[product-index="${ix}"]`
						);
						if (elementToRemove) {
							elementToRemove.remove();
						}
					});

					priceBox.appendChild(removeButton);
					newDiv.appendChild(priceBox);
					productsEl.appendChild(newDiv);
				} else {
				}
			})
			.catch((error) => console.error(error));
	}
}

let productsEl = document.createElement('div');

async function generateProducts(products, callback) {
	let promises = products.map(async (url, ix) => {
			await generateProduct(url, ix);
	});
	await Promise.all(promises);
	callback();
}

window.addEventListener('DOMContentLoaded', (event) => {
	loadURLList((ul) => {
		console.log('Rohlik-Chrome-Ext: Loaded URLs: ');
		console.log(ul);
		if (Array.isArray(ul)) {
			ul = ul.filter((el) => el != null && el != 'null' && el != 'X');
			saveURLList(ul);
			generateProducts(ul, async () => {
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

			});
		}
	});
});

function saveURLList(urlList) {
	chrome.storage.sync.set({ myURLs: urlList }, function () {
		if (chrome.runtime.lastError) {
			console.error('Chyba při ukládání dat: ' + chrome.runtime.lastError);
		} else {
			console.log('Seznam URL adres byl uložen.');
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
