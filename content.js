if (window.location.href.toLowerCase().includes('product')) {
	let btn = document.createElement('button');
	btn.textContent = 'add to list';
	btn.classList.add('addToListBtn');

	document.body.appendChild(btn);
}

window.addEventListener('click', function (event) {
    
	// Tato funkce se spustí při změně URL v historii prohlížeče
	if (window.location.href.toLowerCase().includes('product')) {
		let btn = document.createElement('button');
		btn.textContent = 'add to list';
		btn.classList.add('addToListBtn');

		document.querySelector('#productDetail').appendChild(btn);
		const newHash = window.location.hash;
		console.log('Nový hash:', newHash);
	}

	// Zde můžete volat svou funkci nebo provádět další akce
});
