function generateProduct(url, ix) {
	if (url != null) {
		fetch(url)
			.then((response) => response.text())
			.then((data) => {
				//converts only body of fetched HTML to HTML
				let dc = new DOMParser().parseFromString(
					data.split('<body>')[1],
					'text/html'
				);
				if (
					dc.querySelector('[data-test="product-price"') &&
					dc.querySelector('h2') &&
					dc.querySelector('.detailQuantity')
				) {
					let priceInput = dc.querySelector('[data-test="product-price"');
					if (priceInput.querySelector('span') !== null) {
						priceInput.removeChild(priceInput.querySelector('span'));
					}

					let nameInput = dc.querySelector('h2');

					let detailInput = dc.querySelector('.detailQuantity');

					let newDiv = document.createElement('div');
					newDiv.classList.add('product-box');
					newDiv.setAttribute('product-index', ix);

					let productName = document.createElement('a');
					productName.className = 'product-name';
					productName.href = url;
					productName.target = '_blank';
					newDiv.appendChild(productName);
					newDiv.querySelector('.product-name').textContent =
						nameInput.textContent + ' - ' + detailInput?.textContent;

					let priceBox = document.createElement('div');
					priceBox.classList.add('product-priceBox');
					let productPrice = document.createElement('p');
					productPrice.className = 'product-price';
					productPrice.textContent = priceInput.textContent;
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
					document.querySelector('.prices').appendChild(newDiv);
				}
			})
			.catch((error) => console.error(url));
	}
}

window.addEventListener('DOMContentLoaded', (event) => {
	loadURLList((ul) => {
		console.log('Rohlik-Chrome-Ext: Loaded URLs: ');
		console.log(ul);
		if (Array.isArray(ul)) {
			ul = ul.filter((el) => el != null && el != 'null' && el != 'X');
			saveURLList(ul);
			ul.map((url, ix) => {
				if (url != 'VOID') {
					generateProduct(url, ix);
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

function loadURLList(callback) {
	chrome.storage.sync.get('myURLs', function (data) {
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
