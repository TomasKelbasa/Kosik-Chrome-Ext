if (window.location.href.toLowerCase().includes('product') && document.querySelector(".addToListBtn")) {
	let btn = document.createElement('button');
	btn.textContent = 'add to list';
	btn.classList.add('addToListBtn');

	document.body.appendChild(btn);
}

window.addEventListener('click', function (event) {
	// Tato funkce se spustí při změně URL v historii prohlížeče
	if (window.location.href.toLowerCase().includes('item')) {
		setTimeout(function () {
			let btn = document.createElement('button');
			btn.textContent = 'add to list';
			btn.classList.add('addToListBtn');
			document.querySelector('#productDetail')?.appendChild(btn);
		}, 1000);
	}

	// Zde můžete volat svou funkci nebo provádět další akce
});
