function generateProduct(url, ix) {
	if (url !== null) {
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
						const elementToRemove = document.querySelector(
							`[product-index="${ix}"]`
						);
						if (elementToRemove) {
							elementToRemove.remove();
						}
						urlList[ix] = null;
					});
					priceBox.appendChild(removeButton);
					newDiv.appendChild(priceBox);
					document.querySelector('.prices').appendChild(newDiv);
				}
			})
			.catch((error) => console.error(error));
	}
}

let urlList = [
	'https://www.rohlik.cz/1351609-royal-crown-cola-classic',
	'https://www.rohlik.cz/1367691-pernerka-mouka-psenicna-polohruba',
	'https://www.rohlik.cz/1302745-lindt-excellence-horka-cokolada-s-morskou-soli',
	'https://www.rohlik.cz/1342937-bumbu-original-craft',
	'https://www.rohlik.cz/1351609-royal-crown-cola-classic',
	'https://www.rohlik.cz/1367691-pernerka-mouka-psenicna-polohruba',
	'https://www.rohlik.cz/1302745-lindt-excellence-horka-cokolada-s-morskou-soli',
	'https://www.rohlik.cz/1342937-bumbu-original-craft',
	'https://www.rohlik.cz/1351609-royal-crown-cola-classic',
	'https://www.rohlik.cz/1367691-pernerka-mouka-psenicna-polohruba',
	'https://www.rohlik.cz/1302745-lindt-excellence-horka-cokolada-s-morskou-soli',
	'https://www.rohlik.cz/1342937-bumbu-original-craft',
	'https://www.rohlik.cz/1407202-royal-crown-cola-no-sugar-plech',
];

document.addEventListener('DOMContentLoaded', () => {
	urlList.map((url, ix) => generateProduct(url, ix));
});
