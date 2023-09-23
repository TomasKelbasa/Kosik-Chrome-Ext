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

let lastUrl = null;

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', injectButton);
} else {
	injectButton();
}

window.addEventListener('click', injectButton);

function injectButton(event) {
	// Tato funkce se spustí při změně URL v historii prohlížeče
	setTimeout(() => {
		if (
			document.querySelector('#productDetail') &&
			document.querySelector('#productDetail h2') &&
			(!document.querySelector('.addToListBtn') || lastUrl != window.location.href)
		) {
			
			let btn = document.createElement('button');
			loadURLList((urlList) => {
				if (Array.isArray(urlList)) {
					let newUrl = window.location.href.split('?')[0];
					if (!urlList.includes(newUrl)) {
						btn.classList.remove('warning');
						btn.textContent = 'add to list';
					} else {
						btn.classList.add('warning');
						btn.textContent = 'already on the list';
					}
				}
			});
			btn.classList.add('addToListBtn');
			btn.addEventListener('click', () => {
				loadURLList((urlList) => {
					if (Array.isArray(urlList)) {
						let newUrl = window.location.href.split('?')[0];
						if (!urlList.includes(newUrl)) {
							btn.classList.add('warning');
							btn.textContent = 'added on the list';

							urlList.push(newUrl);
							saveURLList(urlList);
						} else {
						}
					}
					console.log(urlList);
				});
			});
			document.querySelector('#productDetail')?.appendChild(btn);
		}

		lastUrl = window.location.href;
	}, 500);

}
