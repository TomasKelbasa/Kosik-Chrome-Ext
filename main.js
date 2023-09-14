function generateProduct(url, ix) {
	fetch(url)
		.then((response) => response.text())
		.then((data) => {
			//converts only body of fetched HTML to HTML
			let dc = new DOMParser().parseFromString(
				data.split('<body>')[1],
				'text/html'
			);
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
			productName.target = "_blank";
			newDiv.appendChild(productName);
			newDiv.querySelector('.product-name').textContent =
				nameInput.textContent + ' - ' + detailInput?.textContent;
			let productPrice = document.createElement('p');
			productPrice.className = 'product-price';
			newDiv.appendChild(productPrice);
			newDiv.querySelector('.product-price').textContent =
				priceInput.textContent;
			document.querySelector('.prices').appendChild(newDiv);
		})
		.catch((error) => console.error(error));
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
];

urlList.map((url, ix) => generateProduct(url, ix));
