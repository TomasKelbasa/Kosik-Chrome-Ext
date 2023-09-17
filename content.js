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

window.addEventListener('DOMContentLoaded', injectButton);
window.addEventListener('click', injectButton);

function injectButton(event) {
	// Tato funkce se spustí při změně URL v historii prohlížeče
	setTimeout(function () {
		if (
			this.document.querySelector('#productDetail') &&
			!document.querySelector('.addToListBtn')
		) {
			let btn = document.createElement('button');
			btn.textContent = 'add to list';
			btn.classList.add('addToListBtn');
			btn.addEventListener('click', () => {
				loadURLList((urlList) => {
					if (Array.isArray(urlList)) {
						let newUrl = window.location.href.split('?')[0];
						if (!urlList.includes(newUrl)) {
							urlList.push(newUrl);
							saveURLList(urlList);
						}
					}
					console.log(urlList);
				});
			});
			document.querySelector('#productDetail')?.appendChild(btn);
		}
	}, 1000);
}
